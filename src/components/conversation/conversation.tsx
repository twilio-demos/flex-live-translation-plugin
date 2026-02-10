import * as Flex from "@twilio/flex-ui";
import { useEffect, useRef } from "react";
import { useConversation } from "../../hooks/use-conversation";
import ConversationMessageComponent from "../conversation/conversation-message";
import "./conversation.css";

export const Conversation = () => {
  const manager = Flex.Manager.getInstance();
  const worker = manager.workerClient;
  const handle = worker?.attributes.contact_uri.split(":")[1];

  const { conversation, showTranslations } = useConversation(handle);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when conversation updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  return (
    <div className="conversation-container">
      {/* Messages */}
      {conversation.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">No messages in this conversation</p>
        </div>
      ) : (
        <div className="messages-container">
          <h2 className="messages-title">Messages</h2>
          <div className="messages-list">
            {conversation.map((message, index) => (
              <ConversationMessageComponent
                key={`${message.timestamp}-${index}`}
                message={message}
                showTranslation={showTranslations}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </div>
  );
};
