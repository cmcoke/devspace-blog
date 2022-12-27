import fs from 'fs';
import path from 'path';
import Layout from "@/components/Layout";
import Post from '@/components/Post';
import Pagination from '@/components/Pagination';
import CategoryList from '@/components/CategoryList'
import { POSTS_PER_PAGE } from 'config';
import { getPosts } from '@/lib/posts';

export default function BlogPage({ posts, numPages, currentPage, categories }) {

  // console.log(posts);

  return (
    <Layout>
      <div className='flex justify-between flex-col md:flex-row'>

        {/* various blog posts */}
        <div className='w-3/4 mr-10'>
          <h1 className='text-5xl border-b-4 p-5 font-bold'>Blog</h1>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {posts.map((post, index) => (
              <Post key={index} post={post} />
            ))}
          </div>

          <Pagination currentPage={currentPage} numPages={numPages} />
        </div>

        {/* list of categories */}
        <div className='w-1/4'>
          <CategoryList categories={categories} />
        </div>

      </div>
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
  const posts = getPosts();

  // console.log(posts);

  // Get categories for sidebar
  const categories = posts.map((post) => post.frontmatter.category)
  const uniqueCategories = [...new Set(categories)]

  // console.log(uniqueCategories);

  // only show a certain number of posts per blog page (the number of post per page is set in the config/index.js)
  const numPages = Math.ceil(files.length / POSTS_PER_PAGE); // gets the number of posts per page
  const pageIndex = page - 1;
  const orderedPosts = posts.slice(pageIndex * POSTS_PER_PAGE, (pageIndex + 1) * POSTS_PER_PAGE)


  return {
    props: {
      posts: orderedPosts,
      numPages,
      currentPage: page,
      categories: uniqueCategories
    }
  }

}