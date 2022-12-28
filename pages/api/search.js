import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// search API route
export default (req, res) => {
  let posts

  // if on the production (public server) fetch the cache
  if (process.env.NODE_ENV === 'production') {
    // Fetch from cache
    posts = require('../../cache/data').posts
  } else {
    const files = fs.readdirSync(path.join('posts')) // fetch files from the posts folder

    posts = files.map((filename) => {
      const slug = filename.replace('.md', '') // remove the .md extension

      const markdownWithMeta = fs.readFileSync(path.join('posts', filename), 'utf-8')

      const { data: frontmatter } = matter(markdownWithMeta);

      return {
        slug,
        frontmatter,
      }
    })
  }

  // filter results that contain title, excerpt and category
  const results = posts.filter(
    ({ frontmatter: { title, excerpt, category } }) =>
      title.toLowerCase().indexOf(req.query.q) != -1 ||
      excerpt.toLowerCase().indexOf(req.query.q) != -1 ||
      category.toLowerCase().indexOf(req.query.q) != -1
  )

  // console.log(results);

  res.status(200).json(results);
}