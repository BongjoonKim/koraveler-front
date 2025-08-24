import React from "react";
import styled from "styled-components";
import {
  RadioGroup,
  VStack,
  HStack,
  Text,
  Box
} from "@chakra-ui/react";

export interface RadioOption {
  value: string;
  label: string;
  isDisabled?: boolean;
}

export interface CusRadioProps {
  options: (string | RadioOption)[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  label?: string;
  spacing?: number;
  isDisabled?: boolean;
  direction?: 'vertical' | 'horizontal';
  children?: React.ReactNode;
}

export default function CusRadio(props: CusRadioProps) {
  const {
    options,
    value,
    onChange,
    name,
    label,
    spacing = 2,
    isDisabled = false,
    direction = 'vertical',
    children,
    ...otherProps
  } = props;
  
  const Container = direction === 'horizontal' ? HStack : VStack;
  
  return (
    <Box>
      {label && (
        <Text
          fontSize="sm"
          fontWeight="medium"
          color="gray.700"
          mb={2}
        >
          {label}
        </Text>
      )}
      
      <RadioGroup.Root
        value={value}
        onValueChange={onChange}
        name={name}
        disabled={isDisabled}
      >
        <Container align="flex-start" gap={spacing}>
          {options.map((option, index) => {
            const optionValue: string = typeof option === 'string' ? option : option.value;
            const optionLabel: string = typeof option === 'string' ? option : option.label;
            const optionDisabled: boolean = typeof option === 'string' ? false : option.isDisabled || false;
            
            return (
              <RadioGroup.Item key={`${optionValue}-${index}`} value={optionValue} disabled={optionDisabled}>
                <RadioGroup.ItemControl />
                <RadioGroup.ItemText>{optionLabel}</RadioGroup.ItemText>
              </RadioGroup.Item>
            );
          })}
        </Container>
      </RadioGroup.Root>
      {children}
    </Box>
  )
}