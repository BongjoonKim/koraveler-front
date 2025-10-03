import React, { useState } from 'react';
import {
  Box,
  Card,
  Text,
  HStack,
  VStack,
  Input,
  Button,
  Textarea,
  IconButton,
  Tabs,
  Badge
} from "@chakra-ui/react";
import {
  Languages,
  ArrowRightLeft,
  Volume2,
  Copy,
  Mic,
  Send,
  Camera,
  History
} from "lucide-react";
import CusIconButton from "../../elements/buttons/CusIconButton";
import CusButton from "../../elements/buttons/CusButton";

export interface LanguageHelpProps {}

interface Translation {
  id: string;
  source: string;
  target: string;
  timestamp: Date;
}

interface QuickPhrase {
  korean: string;
  english: string;
  pronunciation: string;
  category: string;
}

function LanguageHelp(props: LanguageHelpProps) {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState<'ko' | 'en'>('en');
  const [targetLang, setTargetLang] = useState<'ko' | 'en'>('ko');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [translationHistory, setTranslationHistory] = useState<Translation[]>([]);
  
  // 자주 사용하는 구문들
  const quickPhrases: QuickPhrase[] = [
    {
      korean: '안녕하세요',
      english: 'Hello',
      pronunciation: 'an-nyeong-ha-se-yo',
      category: '인사'
    },
    {
      korean: '감사합니다',
      english: 'Thank you',
      pronunciation: 'gam-sa-ham-ni-da',
      category: '인사'
    },
    {
      korean: '얼마예요?',
      english: 'How much is it?',
      pronunciation: 'eol-ma-ye-yo',
      category: '쇼핑'
    },
    {
      korean: '어디예요?',
      english: 'Where is it?',
      pronunciation: 'eo-di-ye-yo',
      category: '길찾기'
    },
    {
      korean: '맛있어요',
      english: "It's delicious",
      pronunciation: 'mas-iss-eo-yo',
      category: '음식'
    },
    {
      korean: '도와주세요',
      english: 'Please help me',
      pronunciation: 'do-wa-ju-se-yo',
      category: '도움'
    }
  ];
  
  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsLoading(true);
    try {
      // TODO: ChatGPT/LLM API 연동
      // const response = await fetch('/api/translate', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     text: sourceText,
      //     sourceLang,
      //     targetLang
      //   })
      // });
      // const data = await response.json();
      // setTranslatedText(data.translation);
      
      // Mock translation for demo
      setTimeout(() => {
        const mockTranslation = sourceLang === 'en'
          ? '안녕하세요, 번역된 텍스트입니다.'
          : 'Hello, this is translated text.';
        setTranslatedText(mockTranslation);
        
        // Add to history
        const newTranslation: Translation = {
          id: Date.now().toString(),
          source: sourceText,
          target: mockTranslation,
          timestamp: new Date()
        };
        setTranslationHistory(prev => [newTranslation, ...prev.slice(0, 4)]);
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Translation error:', error);
      setIsLoading(false);
    }
  };
  
  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };
  
  const handleSpeak = (text: string, lang: 'ko' | 'en') => {
    // Web Speech API 사용
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ko' ? 'ko-KR' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Toast notification for copy success
  };
  
  return (
    <Card.Root
      bg="white"
      shadow="lg"
      overflow="hidden"
      css={{
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        transition: "all 0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.15)"
        }
      }}
    >
      <Card.Body color="black">
        <VStack align="stretch" gap={4}>
          {/* Header */}
          <HStack justify="space-between">
            <HStack gap={2}>
              <Languages size={24} />
              <Text fontSize="lg" fontWeight="semibold">
                Language Helper
              </Text>
            </HStack>
            <Badge colorScheme="whiteAlpha" bg="whiteAlpha.300">
              AI Powered
            </Badge>
          </HStack>
          
          {/* Tabs */}
          <Tabs.Root
            value={selectedTab.toString()}
            onValueChange={(e : any) => setSelectedTab(parseInt(e.value))}
          >
            <Tabs.List bg="whiteAlpha.200" borderRadius="lg">
              <Tabs.Trigger value="0" color="black">
                Translate
              </Tabs.Trigger>
              <Tabs.Trigger value="1" color="black">
                Quick Phrases
              </Tabs.Trigger>
              <Tabs.Trigger value="2" color="black">
                History
              </Tabs.Trigger>
            </Tabs.List>
            
            <Tabs.Content value="0">
              <VStack gap={3} mt={3}>
                {/* Language Selector */}
                <HStack justify="space-between" w="full">
                  <Button
                    size="sm"
                    variant="outline"
                    color="black"
                    borderColor="whiteAlpha.400"
                    _hover={{ bg: "whiteAlpha.200" }}
                  >
                    {sourceLang === 'en' ? 'English' : '한국어'}
                  </Button>
                  <CusIconButton
                    aria-label="Swap languages"
                    icon={<ArrowRightLeft size={18} />}
                    size="sm"
                    variant="ghost"
                    color="black"
                    onClick={swapLanguages}
                    _hover={{ bg: "whiteAlpha.200" }}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    color="black"
                    borderColor="whiteAlpha.400"
                    _hover={{ bg: "whiteAlpha.200" }}
                  >
                    {targetLang === 'ko' ? '한국어' : 'English'}
                  </Button>
                </HStack>
                
                {/* Input Area */}
                <Box position="relative" w="full">
                  <Textarea
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    placeholder="Enter text to translate..."
                    rows={3}
                    bg="whiteAlpha.200"
                    borderColor="whiteAlpha.400"
                    color="black"
                    _placeholder={{ color: "whiteAlpha.600" }}
                    _hover={{ borderColor: "whiteAlpha.600" }}
                    _focus={{ borderColor: "white", bg: "whiteAlpha.300" }}
                  />
                  <HStack position="absolute" bottom={2} right={2} gap={1}>
                    <CusIconButton
                      aria-label="Voice input"
                      icon={<Mic size={16} />}
                      size="xs"
                      variant="ghost"
                      color="black"
                      _hover={{ bg: "whiteAlpha.300" }}
                    />
                    <CusIconButton
                      aria-label="Camera"
                      icon={<Camera size={16} />}
                      size="xs"
                      variant="ghost"
                      color="black"
                      _hover={{ bg: "whiteAlpha.300" }}
                    />
                  </HStack>
                </Box>
                
                {/* Translate Button */}
                <CusButton
                  w="full"
                  leftIcon={<Send size={18} />}
                  onClick={handleTranslate}
                  isLoading={isLoading}
                  loadingText="Translating..."
                  bg="whiteAlpha.300"
                  color="black"
                  _hover={{ bg: "whiteAlpha.400" }}
                >
                  Translate
                </CusButton>
                
                {/* Translation Result */}
                {translatedText && (
                  <Box
                    w="full"
                    p={3}
                    bg="whiteAlpha.200"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="whiteAlpha.400"
                  >
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="xs" opacity={0.8}>
                        Translation
                      </Text>
                      <HStack gap={1}>
                        <CusIconButton
                          aria-label="Speak"
                          icon={<Volume2 size={14} />}
                          size="xs"
                          variant="ghost"
                          color="black"
                          onClick={() => handleSpeak(translatedText, targetLang)}
                          _hover={{ bg: "whiteAlpha.300" }}
                        />
                        <CusIconButton
                          aria-label="Copy"
                          icon={<Copy size={14} />}
                          size="xs"
                          variant="ghost"
                          color="black"
                          onClick={() => handleCopy(translatedText)}
                          _hover={{ bg: "whiteAlpha.300" }}
                        />
                      </HStack>
                    </HStack>
                    <Text fontSize="md">{translatedText}</Text>
                  </Box>
                )}
              </VStack>
            </Tabs.Content>
            
            <Tabs.Content value="1">
              <VStack gap={2} mt={3} maxH="300px" overflowY="auto">
                {quickPhrases.map((phrase, index) => (
                  <Box
                    key={index}
                    w="full"
                    p={3}
                    bg="whiteAlpha.200"
                    borderRadius="lg"
                    _hover={{ bg: "whiteAlpha.300" }}
                    cursor="pointer"
                    onClick={() => {
                      setSourceText(phrase.english);
                      setTranslatedText(phrase.korean);
                    }}
                  >
                    <HStack justify="space-between">
                      <VStack align="start" gap={0.5}>
                        <HStack>
                          <Text fontWeight="bold" fontSize="md">
                            {phrase.korean}
                          </Text>
                          <Badge size="xs" bg="whiteAlpha.300">
                            {phrase.category}
                          </Badge>
                        </HStack>
                        <Text fontSize="xs" opacity={0.8}>
                          {phrase.pronunciation}
                        </Text>
                        <Text fontSize="sm">{phrase.english}</Text>
                      </VStack>
                      <HStack gap={1}>
                        <CusIconButton
                          aria-label="Speak Korean"
                          icon={<Volume2 size={14} />}
                          size="xs"
                          variant="ghost"
                          color="black"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeak(phrase.korean, 'ko');
                          }}
                          _hover={{ bg: "whiteAlpha.400" }}
                        />
                        <CusIconButton
                          aria-label="Copy"
                          icon={<Copy size={14} />}
                          size="xs"
                          variant="ghost"
                          color="black"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(phrase.korean);
                          }}
                          _hover={{ bg: "whiteAlpha.400" }}
                        />
                      </HStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Tabs.Content>
            
            <Tabs.Content value="2">
              <VStack gap={2} mt={3} maxH="300px" overflowY="auto">
                {translationHistory.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <History size={32} opacity={0.5} />
                    <Text fontSize="sm" opacity={0.7} mt={2}>
                      No translation history yet
                    </Text>
                  </Box>
                ) : (
                  translationHistory.map((item) => (
                    <Box
                      key={item.id}
                      w="full"
                      p={3}
                      bg="whiteAlpha.200"
                      borderRadius="lg"
                      _hover={{ bg: "whiteAlpha.300" }}
                      cursor="pointer"
                      onClick={() => {
                        setSourceText(item.source);
                        setTranslatedText(item.target);
                        setSelectedTab(0);
                      }}
                    >
                      <Text fontSize="sm" fontWeight="medium">
                        {item.source}
                      </Text>
                      <Text fontSize="sm" opacity={0.8}>
                        → {item.target}
                      </Text>
                      <Text fontSize="xs" opacity={0.6} mt={1}>
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </Text>
                    </Box>
                  ))
                )}
              </VStack>
            </Tabs.Content>
          </Tabs.Root>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

export default LanguageHelp;