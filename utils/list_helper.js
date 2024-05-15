const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const likes=blogs.map(x => x.likes)
  return likes.reduce((x, y) => x+y, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length===0) {
    return null
  }

  let favoriteBlog=blogs[0]
  blogs.forEach(b => {
    if (b.likes>favoriteBlog.likes) {
      favoriteBlog=b
    }
  })
  return favoriteBlog
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}