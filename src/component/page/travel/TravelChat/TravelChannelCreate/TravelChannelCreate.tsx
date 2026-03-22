import React, { useState } from "react";
import styled from "styled-components";
import { X } from "lucide-react";
import type { TravelChannelCreateRequest, ChannelContextType } from "../../../../../types/travel/travelChannelTypes";

interface TravelChannelCreateProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (request: TravelChannelCreateRequest) => void;
}

const CONTEXT_OPTIONS: { value: ChannelContextType; label: string; description: string }[] = [
  { value: "GENERAL", label: "General", description: "General discussion" },
  { value: "ITINERARY", label: "Itinerary", description: "Schedule & itinerary planning" },
  { value: "PLACE", label: "Place", description: "Discuss specific places" },
  { value: "MEDIA", label: "Media", description: "Share photos & videos" },
  { value: "INFO", label: "Info", description: "Travel info & tips" },
];

const TravelChannelCreate: React.FC<TravelChannelCreateProps> = ({
  isOpen,
  isLoading,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contextType, setContextType] = useState<ChannelContextType>("GENERAL");
  const [channelPurpose, setChannelPurpose] = useState("");

  const handleSubmit = () => {
    onSubmit({
      name,
      description: description || undefined,
      contextType,
      channelPurpose: channelPurpose || undefined,
    });
    // 초기화
    setName("");
    setDescription("");
    setContextType("GENERAL");
    setChannelPurpose("");
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Create Channel</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={18} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Field>
            <Label>Channel Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Day 1 Planning"
              maxLength={50}
            />
          </Field>

          <Field>
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              maxLength={200}
            />
          </Field>

          <Field>
            <Label>Channel Type</Label>
            <ContextGrid>
              {CONTEXT_OPTIONS.map((opt) => (
                <ContextOption
                  key={opt.value}
                  $selected={contextType === opt.value}
                  onClick={() => setContextType(opt.value)}
                >
                  <ContextLabel>{opt.label}</ContextLabel>
                  <ContextDesc>{opt.description}</ContextDesc>
                </ContextOption>
              ))}
            </ContextGrid>
          </Field>

          <Field>
            <Label>Purpose</Label>
            <Input
              value={channelPurpose}
              onChange={(e) => setChannelPurpose(e.target.value)}
              placeholder="What is this channel for?"
            />
          </Field>
        </ModalBody>

        <ModalFooter>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SubmitButton onClick={handleSubmit} disabled={!name.trim() || isLoading}>
            {isLoading ? "Creating..." : "Create"}
          </SubmitButton>
        </ModalFooter>
      </Modal>
    </Overlay>
  );
};

export default TravelChannelCreate;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 14px;
  width: 90%;
  max-width: 440px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid #f0f0f5;
`;

const ModalTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #8888a0;
  padding: 4px;
  border-radius: 6px;

  &:hover {
    background: #f5f5fa;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Field = styled.div``;

const Label = styled.label`
  display: block;
  font-size: 12.5px;
  font-weight: 600;
  color: #4a4a60;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #e0e0e8;
  border-radius: 8px;
  font-size: 13.5px;
  color: #1a1a2e;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: #6366f1;
  }

  &::placeholder {
    color: #b0b0c0;
  }
`;

const ContextGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const ContextOption = styled.div<{ $selected: boolean }>`
  padding: 10px 12px;
  border: 1.5px solid ${({ $selected }) => ($selected ? "#6366f1" : "#e8e8f0")};
  border-radius: 8px;
  cursor: pointer;
  background: ${({ $selected }) => ($selected ? "#f5f3ff" : "white")};
  transition: all 0.15s;

  &:hover {
    border-color: ${({ $selected }) => ($selected ? "#6366f1" : "#c7c7d5")};
  }
`;

const ContextLabel = styled.div`
  font-size: 12.5px;
  font-weight: 600;
  color: #1a1a2e;
`;

const ContextDesc = styled.div`
  font-size: 11px;
  color: #8888a0;
  margin-top: 2px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 20px;
  border-top: 1px solid #f0f0f5;
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  background: none;
  border: 1px solid #e0e0e8;
  border-radius: 8px;
  font-size: 13px;
  color: #6b6b80;
  cursor: pointer;

  &:hover {
    background: #f8f8fc;
  }
`;

const SubmitButton = styled.button`
  padding: 8px 20px;
  background: #4f46e5;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  cursor: pointer;

  &:hover {
    background: #4338ca;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
