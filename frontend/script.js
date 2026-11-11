
/* =====================================
   1. ELEMENTS
===================================== */

const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatMessages = document.getElementById("chat-messages");
const chatHistory = document.getElementById("chat-history");
const newChatBtn = document.getElementById("new-chat-btn");
const sendBtn = document.getElementById("send-btn");


/* =====================================
   2. CHAT DATA
===================================== */

let conversations = JSON.parse(
    localStorage.getItem("syedshayan_chats") || "[]"
);

let currentConversation = null;
let isWaiting = false;


/* =====================================
   3. TIME FORMAT
===================================== */

function getTime() {
    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}


/* =====================================
   4. SAVE CHAT HISTORY
===================================== */

function saveConversations() {
    localStorage.setItem(
        "syedshayan_chats",
        JSON.stringify(conversations)
    );
}


/* =====================================
   5. SAFE MESSAGE CONTENT
   Supports clickable HTTPS source links
===================================== */


function renderMessageContent(container, message) {

    // Clean escaped Markdown characters
    message = String(message).replace(/\\([*_`])/g, "$1");

    // Convert spaced-out bullet points into separate lines
    message = message.replace(/[ \t]{2,}(?=-\s)/g, "\n");

    function appendInline(parent, text) {

        const pattern = /\*\*(.*?)\*\*|(https?:\/\/[^\s<]+)/g;

        let lastIndex = 0;
        let match;

        while ((match = pattern.exec(text)) !== null) {

            parent.appendChild(
                document.createTextNode(
                    text.slice(lastIndex, match.index)
                )
            );

            if (match[1] !== undefined) {

                const bold = document.createElement("strong");
                bold.textContent = match[1];
                parent.appendChild(bold);

            } else {

                const link = document.createElement("a");
                link.textContent = match[0];
                link.href = match[0];
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.className = "source-link";

                parent.appendChild(link);
            }

            lastIndex = pattern.lastIndex;
        }

        parent.appendChild(
            document.createTextNode(text.slice(lastIndex))
        );
    }

    const lines = message.split("\n");
    let currentList = null;

    lines.forEach(line => {

        const trimmedLine = line.trim();

        if (trimmedLine.startsWith("- ")) {

            if (!currentList) {
                currentList = document.createElement("ul");
                container.appendChild(currentList);
            }

            const item = document.createElement("li");

            appendInline(item, trimmedLine.slice(2));

            currentList.appendChild(item);

        } else {

            currentList = null;

            if (trimmedLine) {

                const paragraph = document.createElement("p");

                appendInline(paragraph, trimmedLine);

                container.appendChild(paragraph);
            }
        }
    });
}




/* =====================================
   6. ADD MESSAGE
===================================== */

function addMessage(message, type, time = getTime()) {

    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}`;

    const content = document.createElement("div");
    content.className = "message-content";

    renderMessageContent(content, String(message));

    const meta = document.createElement("div");
    meta.className = "message-meta";

    const timeSpan = document.createElement("span");
    timeSpan.className = "message-time";
    timeSpan.textContent = time;

    meta.appendChild(timeSpan);

    if (type === "user-message") {

        const ticks = document.createElement("span");
        ticks.className = "message-ticks";
        ticks.textContent = "✓✓";

        meta.appendChild(ticks);
    }

    messageDiv.appendChild(content);
    messageDiv.appendChild(meta);

    if (type === "bot-message") {

        const wrapper = document.createElement("div");
        wrapper.className = "welcome-message";

        const avatar = document.createElement("div");
        avatar.className = "bot-avatar";
        avatar.textContent = "🤖";

        wrapper.appendChild(avatar);
        wrapper.appendChild(messageDiv);

        chatMessages.appendChild(wrapper);

    } else {

        chatMessages.appendChild(messageDiv);
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;

    return messageDiv;
}


/* =====================================
   7. TYPING INDICATOR
===================================== */

function showTyping() {

    const wrapper = document.createElement("div");
    wrapper.className = "welcome-message typing-wrapper";

    const avatar = document.createElement("div");
    avatar.className = "bot-avatar";
    avatar.textContent = "🤖";

    const typing = document.createElement("div");
    typing.className = "message bot-message typing-indicator";
    typing.textContent = "Thinking...";

    wrapper.appendChild(avatar);
    wrapper.appendChild(typing);

    chatMessages.appendChild(wrapper);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    return wrapper;
}


/* =====================================
   8. CHAT HISTORY
===================================== */

function renderHistory() {

    chatHistory.innerHTML = "";

    conversations.forEach(conversation => {

        const historyItem = document.createElement("button");

        historyItem.textContent = "💬 " + conversation.title;
        historyItem.title = conversation.title;

        historyItem.addEventListener("click", () => {
            openConversation(conversation.id);
        });

        chatHistory.appendChild(historyItem);
    });
}


/* =====================================
   9. CREATE NEW CONVERSATION
===================================== */

function createNewChat() {

    if (isWaiting) return;

    const conversation = {
        id: Date.now().toString(),
        title: "New Chat",
        messages: []
    };

    conversations.unshift(conversation);

    currentConversation = conversation;

    chatMessages.innerHTML = "";

    const welcomeMessage =
        "Assalamualaikum! How can I help you today?";

    addMessage(welcomeMessage, "bot-message");

    conversation.messages.push({
        message: welcomeMessage,
        type: "bot-message",
        time: getTime()
    });

    saveConversations();
    renderHistory();

    userInput.focus();
}


/* =====================================
   10. OPEN OLD CONVERSATION
===================================== */

function openConversation(id) {

    if (isWaiting) return;

    const conversation = conversations.find(
        item => item.id === id
    );

    if (!conversation) return;

    currentConversation = conversation;

    chatMessages.innerHTML = "";

    conversation.messages.forEach(item => {

        addMessage(
            item.message,
            item.type,
            item.time
        );

    });

}


/* =====================================
   11. SEND MESSAGE
===================================== */

chatForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (isWaiting) return;

    const question = userInput.value.trim();

    if (!question) return;


    // Create conversation if needed

    if (!currentConversation) {

        currentConversation = {
            id: Date.now().toString(),
            title: question.slice(0, 35),
            messages: []
        };

        conversations.unshift(currentConversation);
    }


    // Update title

    if (currentConversation.messages.length === 0) {

        currentConversation.title = question.slice(0, 35);
    }


    // Show user message

    const userTime = getTime();

    addMessage(
        question,
        "user-message",
        userTime
    );

    currentConversation.messages.push({
        message: question,
        type: "user-message",
        time: userTime
    });


    userInput.value = "";

    isWaiting = true;
    sendBtn.disabled = true;

    const typingMessage = showTyping();


    saveConversations();
    renderHistory();


    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: question
            })

        });


        if (!response.ok) {
            throw new Error("Server response error");
        }


        const data = await response.json();

        typingMessage.remove();


        const answer = data.answer || "Sorry, no answer received.";

        const botTime = getTime();

        addMessage(
            answer,
            "bot-message",
            botTime
        );


        currentConversation.messages.push({
            message: answer,
            type: "bot-message",
            time: botTime
        });


        saveConversations();

    }

    catch (error) {

        typingMessage.remove();

        console.error("Chat Error:", error);

        const errorMessage =
            "Sorry, server se response nahi mila. Please try again.";

        addMessage(
            errorMessage,
            "bot-message"
        );

    }

    finally {

        isWaiting = false;
        sendBtn.disabled = false;

        userInput.focus();

    }

});


/* =====================================
   12. NEW CHAT BUTTON
===================================== */

newChatBtn.addEventListener("click", () => {

    createNewChat();

});


/* =====================================
   13. INITIALIZE APPLICATION
===================================== */

renderHistory();

if (conversations.length > 0) {

    openConversation(conversations[0].id);

} else {

    createNewChat();

}
