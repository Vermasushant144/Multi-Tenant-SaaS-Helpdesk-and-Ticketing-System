import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import './CommentSection.css';

const CommentSection = ({ comments, onAddComment }) => {
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      await onAddComment(commentText);
      setCommentText('');
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="comment-section-container">
      <h3 className="comment-header">
        <MessageSquare size={18} />
        <span>COMMENTS ({comments ? comments.length : 0})</span>
      </h3>

      <div className="comments-list">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment-bubble">
              <div className="comment-meta">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-role-badge">{comment.role}</span>
                <span className="comment-time">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))
        ) : (
          <div className="no-comments">NO_COMMENTS_YET // BE_THE_FIRST_TO_RESPOND</div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-group">
          <textarea
            className="form-textarea comment-input"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="ADD_COMMENT..."
            rows="3"
            required
            disabled={submitting}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-comment-submit" disabled={submitting}>
          <Send size={16} /> {submitting ? 'SENDING...' : 'POST_COMMENT'}
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
