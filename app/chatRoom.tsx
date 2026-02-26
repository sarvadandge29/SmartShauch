import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import ChatHeader from "@/components/ChatHeader";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const ChatRoom = () => {
  const { memberId, memberName } = useLocalSearchParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState<IMessage[]>([]);

  const currentUserId = user?.id as string;

  // Generate consistent room id
  const roomid = [currentUserId, String(memberId)].sort().join("_");

  // Fetch old messages
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("message")
      .select("*")
      .eq("roomid", roomid)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const formatted = data.map((msg) => ({
        _id: msg.id,
        text: msg.message,
        createdAt: new Date(msg.created_at),
        user: {
          _id: msg.senderid,
        },
      }));

      setMessages(formatted);
    }
  };

  useEffect(() => {
    if (!currentUserId) return;

    fetchMessages();

    // Realtime subscription
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message",
          filter: `roomid=eq.${roomid}`,
        },
        (payload) => {
          const newMsg = payload.new;

          const formatted: IMessage = {
            _id: newMsg.id,
            text: newMsg.message,
            createdAt: new Date(newMsg.created_at),
            user: {
              _id: newMsg.senderid,
            },
          };

          setMessages((prev) => GiftedChat.append(prev, [formatted]));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomid]);

  // Send message
  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      const message = newMessages[0];

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );

      await supabase.from("message").insert({
        roomid,
        senderid: currentUserId,
        receiverid: memberId,
        message: message.text,
      });
    },
    [roomid, currentUserId]
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ChatHeader title={String(memberName)} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: currentUserId,
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatRoom;