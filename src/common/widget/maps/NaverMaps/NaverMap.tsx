// common/widget/maps/NaverMaps/NaverMap.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { loadNaverMapScript, isNaverMapLoaded } from '../../../../utils/loadNaverMapScript';
import {useNaverMapController} from "./useNaverMapController";
import {MapController, MapProvider} from "../../../../types/maps/mapTypes";

export interface NaverMapProps {
  center?: { lat: number; lng: number };
  zoom?: number | null;
  width?: string;
  height?: string;
  mapTypeId?: string;
  onMapLoad?: (map: any) => void;
  provider?: MapProvider;
  controller ?: any
}

function NaverMap(props: NaverMapProps) {
  const {
    width,
    height,
    controller,
  } = props
  
  const {error, isReady, mapRef} = controller;
  
  if (error) {
    return (
      <Box w={width} h={height} display="flex" alignItems="center" justifyContent="center" bg="red.50" borderRadius="lg">
        <Text color="red.600">{error}</Text>
      </Box>
    );
  }
  
  if (!isReady) {
    return (
      <Box w={width} h={height} display="flex" alignItems="center" justifyContent="center" bg="gray.50" borderRadius="lg">
        <VStack gap={3}>
          <Spinner size="lg" color="blue.500" />
          <Text fontSize="sm" color="gray.600">ì§€ë„ë¥¼ ë¶ˆëŸ¬ì˜¤ëŠ” ì¤‘...</Text>
        </VStack>
      </Box>
    );
  }
  
  return <Box ref={mapRef} w={width} h={height} borderRadius="lg" />;
}

export default NaverMap;