import { CloseOutlined, FileOutlined } from '@ant-design/icons';
import { useState } from 'react';

import AllowUpload from '../../../../assets/icons/arrowUpload.svg';

// =====================================================
// FORMAT FILE SIZE
// =====================================================

const formatFileSize = (bytes = 0) => {
    const size = Number(bytes) || 0;

    if (size < 1024) {
        return `${size} B`;
    }

    if (size < 1024 * 1024) {
        return `${Math.round(size / 1024)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};
// =====================================================
// CHECK FILE TYPE
// =====================================================

const isAllowedFile = (file) => {
    if (!file) {
        return false;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];

    const fileName = String(file?.name || '').toLowerCase();

    const validType = allowedTypes.includes(file?.type);

    const validExtension = allowedExtensions.some((extension) => fileName.endsWith(extension));

    return validType || validExtension;
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const LeaveDocuments = () => {
    // =====================================================
    // STATE
    // =====================================================

    const [file, setFile] = useState(null);

    const [dragging, setDragging] = useState(false);

    // =====================================================
    // SELECT ONE FILE
    // =====================================================

    const selectFile = (selectedFile) => {
        if (!selectedFile) {
            return;
        }

        // =============================================
        // ONLY PDF / JPG / JPEG / PNG
        // =============================================

        if (!isAllowedFile(selectedFile)) {
            return;
        }

        // =============================================
        // ONLY ONE FILE
        //
        // Selecting another file automatically
        // replaces the previous file.
        // =============================================

        setFile(selectedFile);
    };

    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleFileChange = (event) => {
        const selectedFile = event?.target?.files?.[0];

        selectFile(selectedFile);

        // =============================================
        // RESET INPUT
        //
        // Allows selecting the same file again
        // after removing it.
        // =============================================

        event.target.value = '';
    };

    // =====================================================
    // REMOVE FILE
    // =====================================================

    const removeFile = (event) => {
        event?.preventDefault();

        event?.stopPropagation();

        setFile(null);
    };

    // =====================================================
    // DRAG ENTER / OVER
    // =====================================================

    const handleDragOver = (event) => {
        event.preventDefault();

        event.stopPropagation();

        setDragging(true);
    };

    // =====================================================
    // DRAG LEAVE
    // =====================================================

    const handleDragLeave = (event) => {
        event.preventDefault();

        event.stopPropagation();

        setDragging(false);
    };

    // =====================================================
    // DROP FILE
    // =====================================================

    const handleDrop = (event) => {
        event.preventDefault();

        event.stopPropagation();

        setDragging(false);

        // =============================================
        // ONLY TAKE FIRST FILE
        // =============================================

        const selectedFile = event?.dataTransfer?.files?.[0];

        selectFile(selectedFile);
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div>
            {/* =================================================
                TITLE
            ================================================= */}

            <div className="mb-2 text-sm text-gray-700">Reference Documents</div>

            {/* =================================================
                UPLOAD AREA
            ================================================= */}

            <label
                htmlFor="leave-documents"
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex min-h-[135px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white px-4 py-5 text-center transition ${dragging ? ` border-[#1677ff] bg-[#f8fbff]` : ` border-gray-300 hover:border-[#1677ff] hover:bg-[#f8fbff]`
                    } `}
            >
                {/* =============================================
                    UPLOAD ICON
                ============================================= */}

                <img
                    src={AllowUpload}
                    style={{
                        width: '30px',
                    }}
                    alt=""
                />

                {/* =============================================
                    UPLOAD TEXT
                ============================================= */}

                <div className="mt-1 text-sm text-gray-500">
                    Drag & drop file or <span className="text-[#1677ff]">browse</span>
                </div>

                <div className="mt-1 text-xs text-gray-400">PDF, JPG, PNG — medical cert, flight booking, etc.</div>

                {/* =============================================
                    FILE INPUT
                ============================================= */}

                <input id="leave-documents" type="file" hidden accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
            </label>

            {/* =================================================
                SELECTED FILE
            ================================================= */}

            {file && (
                <div className="mt-2">
                    <div className="flex min-h-[38px] w-full items-center justify-between rounded-lg border border-gray-200 bg-[#fafafa] px-3 py-2">
                        {/* =====================================
                            LEFT
                        ===================================== */}

                        <div className="flex min-w-0 items-center">
                            <FileOutlined className="mr-3 shrink-0 text-base text-[#1677ff]" />

                            <div className="flex min-w-0 items-center">
                                {/* FILE NAME */}

                                <span className="max-w-[500px] truncate text-sm font-medium text-gray-600" title={file?.name}>
                                    {file?.name}
                                </span>

                                {/* FILE SIZE */}

                                <span className="ml-2 shrink-0 text-xs text-gray-400">({formatFileSize(file?.size)})</span>
                            </div>
                        </div>

                        {/* =====================================
                            REMOVE FILE
                        ===================================== */}

                        <button
                            type="button"
                            onClick={removeFile}
                            className="ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-300 transition hover:bg-red-50 hover:text-red-500"
                        >
                            <CloseOutlined className="text-xs" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveDocuments;
