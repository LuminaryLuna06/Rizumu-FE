import Modal from "@rizumu/components/Modal";
import { useState } from "react";

function TestHieu() {
  const [opened, setOpened] = useState(false);
  return (
    <div>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setOpened(true)}
      >
        Open Modal
      </button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Demo Modal"
      >
        <p>This is a basic modal content.</p>
      </Modal>
    </div>
  );
}

export default TestHieu;
