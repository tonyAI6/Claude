import React, { useRef, useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, useColorScheme, Pressable
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { answerOffline } from './src/mira';

const STARTERS = [
  "My doctor prescribed Gonal-F 150 IU — what is this for?",
  "How do I know I'm injecting the right dose?",
  "What is the trigger shot?",
  "What is OHSS and what should I watch for?"
];

function palette(dark) {
  return dark
    ? { ground:'#0d1a19', surface:'#152322', surface2:'#1b2c2a', ink:'#e8efec', inkSoft:'#a9b8b4', inkFaint:'#7d8c88', brand:'#48c8b6', brandDeep:'#6fd8c8', brandTint:'#163a37', line:'rgba(232,239,236,0.14)', urgent:'#ff9d84', urgentBg:'#3a1c16', userBubble:'#0f6e64', userInk:'#f2fbf9' }
    : { ground:'#eef2ee', surface:'#ffffff', surface2:'#f7f4f0', ink:'#162624', inkSoft:'#4c5c58', inkFaint:'#7a8884', brand:'#0f6e64', brandDeep:'#0a4f48', brandTint:'#dcebe8', line:'rgba(22,38,36,0.12)', urgent:'#b5462f', urgentBg:'#fbe6df', userBubble:'#0f6e64', userInk:'#ffffff' };
}

let idSeq = 0;
const nextId = () => ++idSeq;

export default function App() {
  const dark = useColorScheme() === 'dark';
  const c = palette(dark);
  const s = makeStyles(c);
  const scroller = useRef(null);
  const [messages, setMessages] = useState([
    { id: nextId(), role: 'bot', text: "Hi, I'm Mira 👋 I'm here to help you understand your IVF journey — your medicines, your protocol, the steps, and the worries that pop up at 2am.\n\nAsk me anything, or tap one below to start:", src: null, chips: STARTERS }
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const scrollDown = () => setTimeout(() => scroller.current?.scrollToEnd({ animated: true }), 60);

  const ask = useCallback((text) => {
    if (busy || !text.trim()) return;
    setBusy(true);
    setMessages((m) => [...m, { id: nextId(), role: 'user', text }]);
    setInput('');
    scrollDown();
    setTimeout(() => {
      const { urgent, urgentMessage, entry } = answerOffline(text);
      setMessages((m) => {
        const add = [];
        if (urgent) add.push({ id: nextId(), role: 'urgent', text: urgentMessage });
        add.push({ id: nextId(), role: 'bot', text: entry.a, src: entry.src, chips: entry.f || [] });
        return [...m, ...add];
      });
      setBusy(false);
      scrollDown();
    }, 550);
  }, [busy]);

  return (
    <SafeAreaProvider>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <View style={s.head}>
          <View style={s.avatar}><Text style={s.avatarFace}>◕‿◕</Text></View>
          <View>
            <Text style={s.name}>Mira</Text>
            <Text style={s.status}>● Here for you, any time</Text>
          </View>
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView ref={scroller} style={s.log} contentContainerStyle={s.logInner}>
            {messages.map((m) => {
              if (m.role === 'urgent') {
                return (
                  <View key={m.id} style={s.urgent}>
                    <Text style={s.urgentTitle}>⚠️  Please contact your clinic</Text>
                    <Text style={s.urgentBody}>{m.text}</Text>
                  </View>
                );
              }
              const bot = m.role === 'bot';
              return (
                <View key={m.id} style={{ width: '100%' }}>
                  <View style={[s.bubbleWrap, bot ? s.botWrap : s.userWrap]}>
                    <Text style={[s.bubble, bot ? s.botBubble : s.userBubble]}>{m.text}</Text>
                  </View>
                  {bot && m.src ? <Text style={s.source}>📖 Source: {m.src}</Text> : null}
                  {bot && m.chips && m.chips.length ? (
                    <View style={s.chips}>
                      {m.chips.map((q) => (
                        <Pressable key={q} style={s.chip} onPress={() => ask(q)}>
                          <Text style={s.chipText}>{q}</Text>
                        </Pressable>
                      ))}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </ScrollView>

          <View style={s.composer}>
            <TextInput
              style={s.textInput}
              value={input}
              onChangeText={setInput}
              placeholder="Ask anything about IVF…"
              placeholderTextColor={c.inkFaint}
              onSubmitEditing={() => ask(input)}
              returnKeyType="send"
            />
            <TouchableOpacity style={s.send} onPress={() => ask(input)} accessibilityLabel="Send">
              <Text style={s.sendIcon}>➤</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.disclaimer}>Mira shares general education, not medical advice. Always follow your clinic's instructions.</Text>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.surface2 },
    head: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingVertical: 12, backgroundColor: c.brandTint, borderBottomWidth: 1, borderBottomColor: c.line },
    avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: c.brand, alignItems: 'center', justifyContent: 'center' },
    avatarFace: { color: '#fff', fontSize: 15, fontWeight: '700' },
    name: { fontSize: 18, fontWeight: '700', color: c.ink },
    status: { fontSize: 12, color: c.brandDeep },
    log: { flex: 1, backgroundColor: c.surface2 },
    logInner: { padding: 16, gap: 14 },
    bubbleWrap: { maxWidth: '86%' },
    botWrap: { alignSelf: 'flex-start' },
    userWrap: { alignSelf: 'flex-end' },
    bubble: { padding: 12, borderRadius: 18, fontSize: 15.5, lineHeight: 22 },
    botBubble: { backgroundColor: c.surface, color: c.ink, borderWidth: 1, borderColor: c.line, borderBottomLeftRadius: 6 },
    userBubble: { backgroundColor: c.userBubble, color: c.userInk, borderBottomRightRadius: 6 },
    source: { fontSize: 11, color: c.inkFaint, marginTop: 5, marginLeft: 4 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
    chip: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12 },
    chipText: { color: c.brandDeep, fontSize: 13 },
    urgent: { backgroundColor: c.urgentBg, borderWidth: 1, borderColor: c.urgent, borderRadius: 14, padding: 14 },
    urgentTitle: { color: c.urgent, fontWeight: '700', marginBottom: 4, fontSize: 14 },
    urgentBody: { color: c.urgent, fontSize: 13.5, lineHeight: 20 },
    composer: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, backgroundColor: c.surface, borderTopWidth: 1, borderTopColor: c.line },
    textInput: { flex: 1, backgroundColor: c.surface2, borderWidth: 1, borderColor: c.line, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 16, fontSize: 15, color: c.ink },
    send: { width: 46, height: 46, borderRadius: 23, backgroundColor: c.brand, alignItems: 'center', justifyContent: 'center' },
    sendIcon: { color: '#fff', fontSize: 18 },
    disclaimer: { fontSize: 11, color: c.inkFaint, textAlign: 'center', paddingHorizontal: 16, paddingBottom: 8, paddingTop: 6, backgroundColor: c.surface }
  });
}
