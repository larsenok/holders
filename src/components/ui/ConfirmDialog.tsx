// ConfirmDialog.tsx
export default function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-gray-800 border border-yellow-700 text-yellow-100 p-6 rounded shadow-lg w-80">
        <div className="mb-4">{message}</div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-black font-semibold"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
