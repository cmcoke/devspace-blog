import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { sortByDate } from '@/utils/index';

const files = fs.readdirSync(path.join('posts')); // creates an array of the markdown files in the posts folder.

export function getPosts() {

  // creates an array of objects that contain a slug and frontmatter for each markdown file in the posts folder.
  const posts = files.map(filename => {

    const slug = filename.replace('.md', ''); // removes the .md file extension from the name of the markdown file

    // console.log(slug);

    const markdownWithMeta = fs.readFileSync(path.join('posts', filename), 'utf-8'); // gets the file content of the markdown files

    // console.log(markdownWithMeta);

    const { data: frontmatter } = matter(markdownWithMeta); // parse the data from markdownWithMeta into an object

    // console.log(frontmatter);

    return {
      slug,
      frontmatter
    }

  })

  return posts.sort(sortByDate)
}