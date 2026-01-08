alert("JS Loaded!!");
console.log("createModal element:", document.getElementById("createModal"));

console.log("CreateMenu JS Loaded");

const createBtn = document.getElementById("createBtn");
const createModal = document.getElementById("createModal");

console.log("createBtn:", createBtn);
console.log("createModal:", createModal);

if (createBtn && createModal) {
  createBtn.onclick = () => {
    console.log("Create button clicked");
    createModal.classList.remove("hidden");
  };
} else {
  console.log("DEBUG ERROR: Element not found", { createBtn, createModal });
}

const step1 = document.querySelector(".step-1");
const step2 = document.querySelector(".step-2");

const uploadInput = document.getElementById("uploadInput");
const nextBtn = document.getElementById("nextBtn");
const postBtn = document.getElementById("postBtn");

const previewImage = document.getElementById("previewImage");
const previewVideo = document.getElementById("previewVideo");

let uploadedFile = null;

// Open modal
createBtn.onclick = () => createModal.classList.remove("hidden");

// Close when clicking outside
createModal.onclick = (e) => {
  if (e.target === createModal) createModal.classList.add("hidden");
};

// Upload file
uploadInput.addEventListener("change", (e) => {
  uploadedFile = e.target.files[0];
  if (!uploadedFile) return;

  nextBtn.disabled = false;
  nextBtn.classList.remove("disabled");
});

// Step 1 → Step 2
nextBtn.onclick = () => {
  step1.classList.add("hidden");
  step2.classList.remove("hidden");

  const url = URL.createObjectURL(uploadedFile);

  if (uploadedFile.type.startsWith("image")) {
    previewImage.src = url;
    previewImage.classList.remove("hidden");
  } else {
    previewVideo.src = url;
    previewVideo.classList.remove("hidden");
  }
};

// Upload to backend
postBtn.onclick = async () => {
  const caption = document.getElementById("captionInput").value;

  const formData = new FormData();
  formData.append("postText", caption);
  formData.append("image", uploadedFile);

  const res = await fetch("/profile/create", {
    method: "POST",
    body: formData
  });

  if (res.ok) {
    window.location.reload();  // Reload to show pin
  } else {
    alert("Failed to upload");
  }
};
