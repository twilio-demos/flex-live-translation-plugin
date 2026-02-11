import {
  ChatContainer,
  ConversationHeader,
  MessageList,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
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
    <ChatContainer style={{ height: "100%", width: "100%" }}>
      <ConversationHeader>
        <ConversationHeader.Content userName="Live Translation"></ConversationHeader.Content>
      </ConversationHeader>
      <MessageList style={{ height: "100%" }}>
        {conversation.map((m, idx) => (
          <ConversationMessageComponent
            key={`${m.timestamp}-${idx}`}
            message={m}
            showTranslation={showTranslations}
          />
        ))}
        <div ref={messagesEndRef} />
      </MessageList>
    </ChatContainer>
  );
};
