import React, {useState, useCallback, useEffect, MouseEvent} from 'react';
import {
  Box,
  Flex,
  Text,
  Icon,
  Badge,
  Heading,
  IconProps,
  BoxProps,
} from '@chakra-ui/react';
import {ChevronDown, ChevronRight, Folder, FolderOpen} from 'lucide-react';
import {
  StaticTreeDataProvider,
  Tree,
  ControlledTreeEnvironment,
  TreeItem,
  TreeItemIndex,
} from 'react-complex-tree';
import useFolderTree from './useFolderTree';
import 'react-complex-tree/lib/style-modern.css';

// Tooltip 컴포넌트 정의 (Chakra UI v3 방식)
import { Portal } from '@chakra-ui/react';

// Tooltip 컴포넌트
interface TooltipProps {
  children: React.ReactNode;
  label: string;
  fontSize?: string;
  hasArrow?: boolean;
}

const Tooltip = ({ children, label, fontSize = "sm", hasArrow = false }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <Box
      position="relative"
      display="inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <Portal>
          <Box
            position="absolute"
            top="100%"
            left="50%"
            transform="translateX(-50%)"
            mt={1}
            px={2}
            py={1}
            bg="gray.900"
            color="white"
            borderRadius="md"
            fontSize={fontSize}
            whiteSpace="nowrap"
            zIndex={1000}
            _before={hasArrow ? {
              content: '""',
              position: "absolute",
              top: "-4px",
              left: "50%",
              transform: "translateX(-50%)",
              borderLeft: "4px solid transparent",
              borderRight: "4px solid transparent",
              borderBottom: "4px solid",
              borderBottomColor: "gray.900"
            } : undefined}
          >
            {label}
          </Box>
        </Portal>
      )}
    </Box>
  );
};

// 트리 아이템 데이터 타입
export interface TreeItemData extends TreeItem {
  data: FoldersDTO;
  isFolder?: boolean;
  children?: TreeItemIndex[];
}

// 아이콘 컴포넌트 타입 정의
interface CustomIconProps extends IconProps {
  isOpen?: boolean;
}

const GlobeIcon: React.FC<IconProps> = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <path
      d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </Icon>
);

// 컴포넌트 Props 타입
export interface FolderTreeProps {
  treeFolders?: any;
  handleFolderSelect?: (items: TreeItemIndex[]) => void;
  folders?: any;
  selectedFolderId?: string | null;
}

export default function FolderTree(props: FolderTreeProps) {
  const { folders, handleFolderSelect, selectedFolderId } = props;
  
  // 트리 상태 관리
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>(() => {
    // folders가 있으면 모든 폴더 ID를 초기 확장 상태로 설정
    if (folders && Object.keys(folders).length > 0) {
      return Object.keys(folders).filter(key => folders[key]?.isFolder);
    }
    return ['root'];
  });
  const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([]);
  
  // 색상 정의 (하드코딩으로 변경)
  const bg = 'white';
  const borderColor = 'gray.200';
  const headerBg = 'linear-gradient(to right, #3182ce, #805ad5)';
  const hoverBg = 'gray.50';
  const selectedBg = 'blue.50';
  const selectedBorderColor = 'blue.200';
  const textColor = 'gray.700';
  const iconColor = 'gray.500';
  const folderColor = 'orange.500';
  const scrollTrackBg = '#f7fafc';
  const scrollThumbBg = '#cbd5e0';
  const scrollThumbHoverBg = '#a0aec0';
  
  // selectedFolderId가 변경될 때 selectedItems 업데이트
  useEffect(() => {
    if (selectedFolderId) {
      const foundKey = Object.keys(folders || {}).find(key =>
        folders[key].data?.id === selectedFolderId
      );
      setSelectedItems(foundKey ? [foundKey] : []);
    } else {
      setSelectedItems([]);
    }
  }, [selectedFolderId, folders]);
  
  // 선택 토글 핸들러
  const handleSelectionChange = useCallback((newSelectedItems: TreeItemIndex[]) => {
    // 새로 선택된 아이템이 있고, 현재 선택된 아이템과 같다면 선택 해제
    if (newSelectedItems.length > 0 && selectedItems.length > 0) {
      const newItem = newSelectedItems[0];
      const currentItem = selectedItems[0];
      
      if (newItem === currentItem) {
        // 같은 아이템을 다시 클릭한 경우 선택 해제
        setSelectedItems([]);
        handleFolderSelect?.([]);
        return;
      }
    }
    
    // 일반적인 선택 처리
    setSelectedItems(newSelectedItems);
    handleFolderSelect?.(newSelectedItems);
  }, [selectedItems, handleFolderSelect]);
  
  // 화살표 클릭 핸들러 - 폴더 토글 전용
  const handleArrowClick = useCallback((itemIndex: TreeItemIndex, isExpanded: boolean, e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 클릭 이벤트 방지
    
    if (isExpanded) {
      setExpandedItems(expandedItems.filter(index => index !== itemIndex));
    } else {
      setExpandedItems([...expandedItems, itemIndex]);
    }
  }, [expandedItems]);
  
  const handleToggleExpand = useCallback((itemIndex: TreeItemIndex, e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      
      setExpandedItems(prev => {
        if (!prev.includes(itemIndex)) {
          return [...prev, itemIndex]
        } else {
          return prev.filter(el => el !==itemIndex);
        }
      })
  }, [expandedItems])
  
  const renderItemArrow = useCallback(() => null, []);
  
  const renderItemTitle = useCallback(({ item, context }: any) => {
    const isExpanded = expandedItems.includes(item.index);
    const hasChildren = item.isFolder && item.children && item.children.length > 0;
    
    return (
      <Flex
        align="center"
        // py={2}
        // px={3}
        borderRadius="md"
        cursor="pointer"
        // bg={context.isSelected ? selectedBg : 'transparent'}
        // _hover={{ bg: context.isSelected ? selectedBg : hoverBg }}
        transition="all 0.2s"
        width="100%"
      >
        {/* ✅ lucide 폴더 아이콘 - 열림/닫힘 상태에 따라 다른 아이콘 */}
        <Box mr={2} flexShrink={0}>
          {isExpanded ? (
            <FolderOpen size={20} color="#90c7ec" />
          ) : (
            <Folder size={20} color="#90c7ec" />
          )}
        </Box>
        
        {/* 폴더 이름 */}
        <Text
          fontSize="sm"
          fontWeight="medium"
          color={textColor}
          flex={1}
          truncate
        >
          {item.data?.name || 'Untitled'}
        </Text>
        
        {/* 공개 배지 */}
        {item.data?.public && (
          <Badge
            colorScheme="green"
            variant="solid"
            borderRadius="full"
            px={2}
            py={0.5}
            fontSize="10px"
            display="flex"
            alignItems="center"
            gap={1}
            mr={2}
          >
            <GlobeIcon boxSize={2.5} />
            공개
          </Badge>
        )}
        
        {/* ✅ 화살표 버튼 - 오른쪽에 배치 */}
        {hasChildren && (
          <Box
            onClick={(e) => handleToggleExpand(item.index, e)}
            cursor="pointer"
            p={1}
            borderRadius="md"
            _hover={{ bg: 'gray.200' }}
            transition="all 0.2s"
            flexShrink={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {isExpanded ? (
              <ChevronDown size={18} color="#718096" />
            ) : (
              <ChevronRight size={18} color="#718096" />
            )}
          </Box>
        )}
      </Flex>
    );
  }, [expandedItems, handleToggleExpand, selectedBg, hoverBg, folderColor, textColor]);
  
  
  // 로딩 상태 처리
  if (!folders || Object.keys(folders).length <= 1) {
    return (
      <Box
        bg={bg}
        borderRadius="xl"
        boxShadow="lg"
        border="1px"
        borderColor={borderColor}
        p={6}
        textAlign="center"
      >
        <Text color={textColor} fontSize="sm">
          폴더를 불러오는 중... 또는 폴더가 없습니다.
        </Text>
      </Box>
    );
  }
  
  return (
    <Box
      py={3}
      maxH="400px"
      overflowY="auto"
    >
      <ControlledTreeEnvironment
        items={folders}
        getItemTitle={(item: TreeItemData) => item.data?.name || 'Untitled'}
        viewState={{
          ['tree-1']: {
            expandedItems,
            selectedItems,
          },
        }}
        // 폴더 클릭 시 확장/축소를 비활성화
        // onExpandItem={(item) => {
        //   setExpandedItems(prev => [...prev, item.index])
        // }} // 빈 함수로 비활성화
        // onCollapseItem={(item) => {
        //   setExpandedItems(prev => prev.filter(id => id !== item.index))
        // }} // 빈 함수로 비활성화
        onSelectItems={handleSelectionChange}
        canDragAndDrop={false}
        canDropOnFolder={true}
        canReorderItems={true}
        renderItemArrow={renderItemArrow}
        renderItemTitle={renderItemTitle}
      >
        <Tree
          treeId="tree-1"
          rootItem="root"
          treeLabel="폴더 구조"
        />
      </ControlledTreeEnvironment>
    </Box>
  );
}