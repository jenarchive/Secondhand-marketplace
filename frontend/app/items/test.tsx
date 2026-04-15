import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

const ChatScreen = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello Developer! Send me a message.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native Bot',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    setTimeout(() => {
      const reply: IMessage = {
        _id: Math.random(), // Note: In production, use a more robust ID generator
        text: "I received your message!",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native Bot',
          avatar: 'https://placeimg.com/140/140/any',
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [reply])
      );
    }, 1500);
  }, []);

  return (
  <GiftedChat
  messages={messages}
  onSend={(msgs) => onSend(msgs)}
  user={{ _id: 1 }}
  listViewProps={{
    keyboardShouldPersistTaps: 'never',
  }}
  // Only add this if you strictly need to see what the user is typing
  {...({ onTextChanged: (text: string) => console.log(text) } as any)}
/>
  );
};

export default ChatScreen;