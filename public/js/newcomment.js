const newCmtHandler = async (event) => {
  console.log("in comment button")
  event.preventDefault();

  const comment = document.querySelector('#cmt-content').value.trim();
  const tempLocation = window.location.toString().split('/')[window.location.toString().split('/').length - 1];
  const tempArray = tempLocation.split('?')
  const post_id = parseInt(tempArray[0])


  if (comment && post_id) {
    const response = await fetch(`/api/comments/`, {
      method: 'POST',
      body: JSON.stringify({ comment, post_id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace(`/blogroutes/${post_id}`);
    } else {
      alert('Failed to create comment');
    }
  }
};

console.log("in comment before cmtform")
document
  .querySelector('.new-cmt-form')
  .addEventListener('submit', newCmtHandler);

