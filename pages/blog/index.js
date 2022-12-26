import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Layout from "@/components/Layout";
import Post from '@/components/Post';
import { sortByDate } from 'utils';

export default function BlogPage({ posts }) {

  // console.log(posts);

  return (
    <Layout title={'Blog'}>
      <h1 className='text-5xl border-b-4 p-5 font-bold'>Blog</h1>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {posts.map((post, index) => (
          <Post key={index} post={post} />
        ))}
      </div>

    </Layout>
  )
}


// gets the data from the posts folder and pass it to the 'HomePage' component as a prop called 'posts'
export async function getStaticProps() {

  const files = fs.readdirSync(path.join('posts')); // creates an array of the markdown files in the posts folder.

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

  // console.log(posts);

  return {
    props: {
      posts: posts.sort(sortByDate) // calls the 'sortByDate()' to sort the posts by the most recent date.
    }
  }

}