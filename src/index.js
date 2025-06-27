let selectedPostId = null;

function displayPosts() {
  fetch("http://localhost:3000/posts")
    .then(response => response.json())
    .then(posts => {
      let postList = document.getElementById("post-list");
      postList.innerHTML = "";

      posts.forEach(post => {
        let li = document.createElement("li");
        li.textContent = post.title;
        li.dataset.id = post.id;
        li.style.cursor = "pointer";

        li.addEventListener("click", () => {
          selectedPostId = post.id;
          displayPostDetails(post);
        });

        postList.appendChild(li);
      });
    });
}

function displayPostDetails(post) {
  document.getElementById("post-title").value = post.title || "";
  document.getElementById("post-content").value = post.content || "";
  document.getElementById("post-author").value = post.author || "";
  document.getElementById("post-date").value = post.date || "";

  const postImage = document.getElementById("post-image");
  const imageSource = post.imageUrl || post.image;
  postImage.src =imageSource || "";
  postImage.alt =post.title || "post image"

if (imageSource && imageSource.trim() !== "") {
  postImage.src = imageSource;
  postImage.alt = post.title || "Post image";
} else {
  postImage.src = "";
  postImage.alt = "No image available";
}

  document.getElementById("delete-btn").onclick = () => {
    if (!selectedPostId) return alert("No post selected to delete.");
    if (confirm("Are you sure you want to delete this post?")) {

      fetch(`http://localhost:3000/posts/${selectedPostId}`, {
        method: "DELETE"
      }).then(() => {
        selectedPostId = null;
        displayPosts();
        clearPostDetails();
        hideEditForm();
      });
    }
  };

  document.getElementById("edit-btn").onclick = () => {
    if (!selectedPostId) return alert("No post selected to edit.");
    const form = document.getElementById("edit-post-form");
    form.classList.remove("hidden");
    form.dataset.postId = selectedPostId;
    document.getElementById("edit-title").value = post.title || "";
    document.getElementById("edit-content").value = post.content || "";
  };
}

function clearPostDetails() {
  document.getElementById("post-title").value = "";
  document.getElementById("post-content").value = "";
  document.getElementById("post-author").value = "";
  document.getElementById("post-date").value = "";
  document.getElementById("post-image").style.backgroundImage = "none";
}

function addNewPostListener() {
  const form = document.getElementById("new-post-form");
  const error = document.getElementById("error");

  form.addEventListener("submit", event => {
    event.preventDefault();

    const title = document.getElementById("new-title").value.trim();
    const content = document.getElementById("new-content").value.trim();
    const author = document.getElementById("new-author").value.trim();
    const imageUrl = document.getElementById("new-image").value.trim();

    if (!title || !content || !author) {
      error.classList.remove("hidden");
      return;
    }
    error.classList.add("hidden");

    const newPost = {
      title,
      content,
      author,
      date: new Date().toISOString().slice(0, 10),
      imageUrl
    };

    fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
    .then(res => res.json())
    .then(() => {
      form.reset();
      displayPosts();
    });
  });
}

function setupEditPostForm() {
  const form = document.getElementById("edit-post-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const postId = form.dataset.postId;
    const title = document.getElementById("edit-title").value.trim();
    const content = document.getElementById("edit-content").value.trim();

    if (!title || !content) {
      alert("Please fill in title and content");
      return;
    }

    const updatedPost = { title, content };

    fetch(`http://localhost:3000/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost)
    })
    .then(res => res.json())
    .then(updated => {
      displayPosts();
      displayPostDetails(updated);
      hideEditForm();
    });
  });
}

function hideEditForm() {
  document.getElementById("edit-post-form").classList.add("hidden");
}

function main() {
  displayPosts();
  addNewPostListener();
  setupEditPostForm();
}

main();
