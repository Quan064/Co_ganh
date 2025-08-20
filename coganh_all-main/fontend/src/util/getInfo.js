export default function handleGetInfo(id, setProfile, setPage) {
    fetch(`https://vccp-be.vercel.app/creator/getCreator/${id}`, {
      method: "GET",
    })
      .then(res => res.json())
      .then(data => setProfile(data))
      .then(() => setPage({route: 'creator' }))
  }