import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Layout from "@/components/Layout";
import Post from '@/components/Post';
import Pagination from '@/components/Pagination';
import { sortByDate } from 'utils';
import { POSTS_PER_PAGE } from 'config';

export default function BlogPage({ posts, numPages, currentPage }) {

  // console.log(posts);

  return (
    <Layout title={'Blog'}>
      <h1 className='text-5xl border-b-4 p-5 font-bold'>Blog</h1>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {posts.map((post, index) => (
          <Post key={index} post={post} />
        ))}
      </div>

      <Pagination currentPage={currentPage} numPages={numPages} />

    </Layout>
  )
}


export async function getStaticPaths() {

  const files = fs.readdirSync(path.join('posts')); // creates an array of the markdown files in the posts folder.

  const numPages = Math.ceil(files.length / POSTS_PER_PAGE); // gets the number of posts per page

  // generate the different paths
  let paths = [];

  for (let i = 1; i <= numPages; i++) {
    paths.push({
      params: { page_index: i.toString() }
    })
  }

  // console.log(paths);

  return {
    paths,
    fallback: false
  }

}


// gets the data from the posts folder and pass it to the 'BlogPage' component as a prop called 'posts'
export async function getStaticProps({ params }) {

  // checks the page index and ensures that the first page is 1 by default if a page index does not exist
  const page = parseInt((params && params.page_index) || 1);


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

  // only show a certain number of posts per blog page (the number of post per page is set in the config/index.js)
  const numPages = Math.ceil(files.length / POSTS_PER_PAGE); // gets the number of posts per page
  const pageIndex = page - 1;
  const orderedPosts = posts
    .sort(sortByDate) // calls the 'sortByDate()' to sort the posts by the most recent date.
    .slice(pageIndex * POSTS_PER_PAGE, (pageIndex + 1) * POSTS_PER_PAGE)


  return {
    props: {
      posts: orderedPosts,
      numPages,
      currentPage: page
    }
  }

}