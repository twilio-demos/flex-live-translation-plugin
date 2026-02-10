"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { type ConversationMessage } from "types/profiles";

export type ConversationProps = {
  serverConversation: ConversationMessage[];
};

export const useConversation = (workerHandle: string) => {
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);

  const [showTranslations, setShowTranslations] = useState(true);
  const [isPolling, setIsPolling] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const callerMessages = useMemo(
    () => conversation.filter((m) => m.whichParty === "caller").length,
    [conversation]
  );

  const calleeMessages = useMemo(
    () => conversation.filter((m) => m.whichParty === "callee").length,
    [conversation]
  );

  const languages = useMemo(
    () =>
      conversation.reduce((acc, msg) => {
        acc.add(msg.originalLanguageCode);
        acc.add(msg.translatedLanguageCode);
        return acc;
      }, new Set<string>()),
    [conversation]
  );

  useEffect(() => {
    const pollMessages = async () => {
      try {
        const response = await fetch(
          `https://smn0iajild.execute-api.us-east-1.amazonaws.com/active-conversation?workerHandle=${workerHandle}`
        );

        if (response.ok) {
          const data = await response.json();
          console.log({ data });
          if (data.messages && data.messages.length > 0) {
            // Transform API data to match ConversationMessage interface
            const transformedMessages: ConversationMessage[] =
              data.messages.map((msg: any) => {
                console.log("Raw message:", msg);
                console.log("msg.ts:", msg.ts, "Type:", typeof msg.ts);
                const transformed = {
                  conversationId: msg.pk || "",
                  timestamp: msg.chat?.ts,
                  whichParty: msg.chat?.whichParty,
                  partyConnectionId: msg.partyConnectionId,
                  original: msg.chat?.original || "",
                  originalLanguageCode: msg.chat?.originalLanguageCode || "",
                  translated: msg.chat?.translated || "",
                  translatedLanguageCode:
                    msg.chat?.translatedLanguageCode || "",
                };
                console.log("Transformed message:", transformed);
                return transformed;
              });
            console.log("All transformed messages:", transformedMessages);
            setConversation(transformedMessages);
          }
        }
      } catch (error) {
        console.error("Error polling messages:", error);
      }
    };

    pollMessages();

    intervalRef.current = setInterval(pollMessages, 2000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [workerHandle, isPolling]);

  return {
    conversation,
    showTranslations,
    isPolling,
    setIsPolling,
    setShowTranslations,
    calleeMessages,
    callerMessages,
    languages,
  };
};
