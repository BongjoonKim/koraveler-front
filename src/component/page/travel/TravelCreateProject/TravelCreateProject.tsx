import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Container } from "@chakra-ui/react";
import {
  MapPin,
  Calendar,
  Tag,
  Eye,
  EyeOff,
  ArrowLeft,
  Plus,
  X,
  Plane,
} from "lucide-react";
import { useCreateTravel } from "../../../../hooks/useTravelQueries";
import {
  TravelCreateRequest,
  TravelVisibility,
} from "../../../../types/travel/travelTypes";

export interface TravelCreateProjectProps {}

function TravelCreateProject(props: TravelCreateProjectProps) {
  const navigate = useNavigate();
  const createTravel = useCreateTravel();
  const [loaded, setLoaded] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState<TravelCreateRequest>({
    title: "",
    description: "",
    visibility: "PRIVATE",
    startDate: "",
    endDate: "",
    destination: "",
    tags: [],
  });

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVisibilityToggle = () => {
    setForm((prev) => ({
      ...prev,
      visibility:
        prev.visibility === "PRIVATE" ? "PUBLIC" : "PRIVATE",
    }));
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !form.tags?.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), trimmed],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag),
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      const result = await createTravel.mutateAsync(form);
      navigate(`/travel/dashboard/${result.id}`);
    } catch (error) {
      console.error("Travel creation failed:", error);
    }
  };

  const isFormValid = form.title.trim().length > 0;

  return (
    <Container
      maxW="7xl"
      px={{ base: 4, sm: 6, lg: 8 }}
      h={"100%"}
      flex={"1"}
      flexDirection={"column"}
      display={"flex"}
    >
    <StyledTravelCreateProject>
      <div className="create-header">
        <button className="back-btn" onClick={() => navigate("/travel/home")}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      <div className="create-content">
        <div className="create-title-section">
          <div className="create-icon-wrap">
            <Plane size={28} />
          </div>
          <h1 className="create-heading">New Travel Project</h1>
          <p className="create-subheading">
            Plan your next adventure
          </p>
        </div>

        <form className="create-form" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="Where are you going?"
              value={form.title}
              onChange={handleChange}
              maxLength={100}
            />
            <span className="char-count">{form.title.length}/100</span>
          </div>

          {/* Destination */}
          <div className="form-group">
            <label className="form-label">
              <MapPin size={14} />
              Destination
            </label>
            <input
              type="text"
              name="destination"
              className="form-input"
              placeholder="e.g. Tokyo, Paris, London"
              value={form.destination || ""}
              onChange={handleChange}
            />
          </div>

          {/* Dates */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <Calendar size={14} />
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                className="form-input"
                value={form.startDate || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <Calendar size={14} />
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                className="form-input"
                value={form.endDate || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              placeholder="What's this trip about?"
              value={form.description || ""}
              onChange={handleChange}
              rows={4}
              maxLength={2000}
            />
            <span className="char-count">
              {(form.description || "").length}/2000
            </span>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">
              <Tag size={14} />
              Tags
            </label>
            <div className="tags-input-wrap">
              {form.tags?.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                className="tag-input"
                placeholder="Add tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
            </div>
          </div>

          {/* Visibility */}
          <div className="form-group">
            <label className="form-label">Visibility</label>
            <button
              type="button"
              className={`visibility-toggle ${form.visibility === "PUBLIC" ? "public" : "private"}`}
              onClick={handleVisibilityToggle}
            >
              {form.visibility === "PUBLIC" ? (
                <>
                  <Eye size={16} />
                  <span>Public</span>
                </>
              ) : (
                <>
                  <EyeOff size={16} />
                  <span>Private</span>
                </>
              )}
            </button>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/travel/home")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-create"
              disabled={!isFormValid || createTravel.isPending}
            >
              {createTravel.isPending ? (
                <span className="loading-spinner" />
              ) : (
                <>
                  <Plus size={18} />
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </StyledTravelCreateProject>
    </Container>
  );
}

export default TravelCreateProject;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const StyledTravelCreateProject = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 1rem 2rem 3rem;
  font-family: "Noto Sans KR", sans-serif;

  .create-header {
    margin-bottom: 2rem;
      width: 100%;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: none;
    background: rgba(99, 102, 241, 0.1);
    border-radius: 12px;
    color: #4f46e5;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
      background: rgba(99, 102, 241, 0.2);
      color: #3730a3;
    }
  }

  .create-content {
    max-width: 640px;
    margin: 0 auto;
  }

  .create-title-section {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .create-icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.05));
    color: #8b5cf6;
    margin-bottom: 1rem;
  }

  .create-heading {
    font-family: "Playfair Display", serif;
    font-size: 32px;
    font-weight: 700;
    color: #1e1b4b;
    margin-bottom: 6px;
  }

  .create-subheading {
    font-size: 15px;
    color: #6366f1;
    font-weight: 300;
  }

  .create-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    position: relative;
  }

  .form-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #3730a3;
    letter-spacing: 0.02em;
  }

  .form-input {
    padding: 12px 16px;
    border: 1.5px solid rgba(99, 102, 241, 0.25);
    border-radius: 14px;
    font-size: 15px;
    font-family: "Noto Sans KR", sans-serif;
    color: #1e1b4b;
    background: rgba(255, 255, 255, 0.8);
    transition: all 0.25s ease;
    outline: none;

    &:focus {
      border-color: rgba(139, 92, 246, 0.6);
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.08);
    }

    &::placeholder {
      color: #a5b4fc;
    }
  }

  .form-textarea {
    padding: 12px 16px;
    border: 1.5px solid rgba(99, 102, 241, 0.25);
    border-radius: 14px;
    font-size: 15px;
    font-family: "Noto Sans KR", sans-serif;
    color: #1e1b4b;
    background: rgba(255, 255, 255, 0.8);
    transition: all 0.25s ease;
    outline: none;
    resize: vertical;
    min-height: 100px;

    &:focus {
      border-color: rgba(139, 92, 246, 0.6);
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.08);
    }

    &::placeholder {
      color: #a5b4fc;
    }
  }

  .char-count {
    position: absolute;
    right: 12px;
    bottom: 10px;
    font-size: 11px;
    color: #a5b4fc;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  /* Tags */
  .tags-input-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px 14px;
    border: 1.5px solid rgba(99, 102, 241, 0.25);
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.8);
    min-height: 48px;
    align-items: center;
    transition: all 0.25s ease;

    &:focus-within {
      border-color: rgba(139, 92, 246, 0.6);
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.08);
    }
  }

  .tag-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    background: rgba(139, 92, 246, 0.12);
    color: #4f46e5;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
  }

  .tag-remove {
    display: flex;
    align-items: center;
    border: none;
    background: none;
    color: #6366f1;
    cursor: pointer;
    padding: 0;
    margin-left: 2px;

    &:hover {
      color: #c0392b;
    }
  }

  .tag-input {
    flex: 1;
    min-width: 120px;
    border: none;
    outline: none;
    font-size: 14px;
    font-family: "Noto Sans KR", sans-serif;
    color: #1e1b4b;
    background: transparent;

    &::placeholder {
      color: #a5b4fc;
    }
  }

  /* Visibility */
  .visibility-toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border: 1.5px solid rgba(99, 102, 241, 0.25);
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.8);
    color: #4f46e5;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s ease;
    width: fit-content;

    &.public {
      border-color: rgba(46, 125, 50, 0.3);
      background: rgba(46, 125, 50, 0.05);
      color: #2e7d32;
    }

    &:hover {
      border-color: rgba(139, 92, 246, 0.5);
    }
  }

  /* Actions */
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(99, 102, 241, 0.15);
  }

  .btn-cancel {
    padding: 12px 24px;
    border: 1.5px solid rgba(99, 102, 241, 0.25);
    border-radius: 14px;
    background: transparent;
    color: #4f46e5;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
      background: rgba(99, 102, 241, 0.1);
    }
  }

  .btn-create {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 12px 28px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 160px;
    justify-content: center;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(139, 92, 246, 0.35);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .loading-spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: ${spin} 0.6s linear infinite;
  }

  @media screen and (max-width: 600px) {
    padding: 1rem;

    .create-heading {
      font-size: 26px;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .form-actions {
      flex-direction: column;
    }

    .btn-cancel,
    .btn-create {
      width: 100%;
      justify-content: center;
    }
  }
`;
