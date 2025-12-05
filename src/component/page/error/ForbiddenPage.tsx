import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function ForbiddenPage() {
  const navigate = useNavigate();
  
  return (
    <Box textAlign="center" py={10}>
      <Heading size="2xl" mb={4}>403</Heading>
      <Text fontSize="xl" mb={6}>
        접근 권한이 없습니다
      </Text>
      <Button onClick={() => navigate('/')}>
        홈으로 돌아가기
      </Button>
    </Box>
  );
}