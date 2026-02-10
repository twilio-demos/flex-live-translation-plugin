import { ConversationMessage } from "types/profiles";
import "./conversation-message.css";

export type ConversationMessageProps = {
  message: ConversationMessage;
  showTranslation?: boolean;
};

export default function ConversationMessageComponent({
  message,
  showTranslation = true,
}: ConversationMessageProps) {
  const isCaller = message.whichParty === "caller";

  return (
    <div className={`message-wrapper ${isCaller ? "caller" : "agent"}`}>
      <div className={`message-content ${isCaller ? "caller" : "agent"}`}>
        <div className="message-header">
          <span className="message-party">{message.whichParty}</span>
          <span className="message-time">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>

        <div className="message-section">
          <p className="message-label">
            Original ({message.originalLanguageCode}):
          </p>
          <p className="message-text">{message.original}</p>
        </div>

        {showTranslation && (
          <div className="message-translation">
            <p className="message-label">
              Translated ({message.translatedLanguageCode}):
            </p>
            <p className="message-text italic">{message.translated}</p>
          </div>
        )}
      </div>
    </div>
  );
}
