import React, { useState } from 'react';
import './ReasonModal.css';

const ReasonModal = ({ isOpen, onClose, onConfirm, actionType }) => {
    const [selectedReason, setSelectedReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [showCustom, setShowCustom] = useState(false);

    if (!isOpen) return null;

    const quickReasons = {
        ADD: ['New Stock', 'Restock', 'Return', 'Adjustment'],
        UPDATE: ['Correction', 'Damaged', 'Expired', 'Revaluation'],
        DELETE: ['Sold', 'Damaged', 'Expired', 'Lost']
    };

    const reasons = quickReasons[actionType] || ['Other'];

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalReason = showCustom ? customReason : selectedReason;
        if (finalReason) {
            onConfirm(finalReason);
            setSelectedReason('');
            setCustomReason('');
            setShowCustom(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Reason for {actionType}</h2>
                <div className="quick-reasons">
                    {reasons.map(reason => (
                        <button
                            key={reason}
                            type="button"
                            className={`btn ${selectedReason === reason && !showCustom ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => {
                                setSelectedReason(reason);
                                setShowCustom(false);
                            }}
                        >
                            {reason}
                        </button>
                    ))}
                    <button
                        type="button"
                        className={`btn ${showCustom ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setShowCustom(true)}
                    >
                        Other
                    </button>
                </div>

                {showCustom && (
                    <div className="form-group custom-reason-input">
                        <textarea
                            placeholder="Enter custom reason..."
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                            rows="3"
                        />
                    </div>
                )}

                <div className="modal-actions">
                    <button onClick={onClose} className="btn btn-secondary">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        className="btn btn-primary"
                        disabled={!showCustom && !selectedReason}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReasonModal;
