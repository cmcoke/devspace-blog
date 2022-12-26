import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import marked from 'marked'
import Link from 'next/link';
import Layout from '@/components/Layout';
import CategoryLabel from '@/components/CategoryLabel';

export default function PostPage({ frontmatter: { title, category, date, cover_image, author, author_image }, content, slug }) {

  // console.log(frontmatter);
  // console.log(content);
  // console.log(slug);

  return (
    <Layout title={title}>

      <Link href='/blog'>Go Back</Link>

      <div className='w-full px-10 py-6 bg-white rounded-lg shadow-md mt-6'>

        {/* blog post title & category type */}
        <div className='flex justify-between items-center mt-4'>
          <h1 className='text-5xl mb-7'>{title}</h1>
          <CategoryLabel>{category}</CategoryLabel>
        </div>

        {/* image */}
        <img src={cover_image} alt='' className='w-full rounded' />

        {/* author image & name */}
        <div className='flex justify-between items-center bg-gray-100 p-2 my-8'>
          <div className='flex items-center'>
            <img
              src={author_image}
              alt=''
              className='mx-4 w-10 h-10 object-cover rounded-full hidden sm:block'
            />
            <h4>{author}</h4>
          </div>
          <div className='mr-4'>{date}</div>
        </div>

        {/* blog post content */}
        <div className='blog-text mt-2'>
          <div dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
        </div>

      </div>
    </Layout>
  )
}

// generate the different url paths for the individual posts
export async function getStaticPaths() {

  const files = fs.readdirSync(path.join('posts')); // creates an array of the markdown files in the posts folder.

  // creates an array of objects that contain params which contains slug for the file name
  const paths = files.map(filename => ({
    params: {
      slug: filename.replace('.md', '')
    }
  }))

  // console.log(paths);

  return {
    paths,
    fallback: false // if a user goes to a path that does not exist, the 404 page will be shown
  }

}


// gets the data from the posts folder and pass it to the 'PostPage' component the prop 'frontmatter', 'content', 'slug'
export async function getStaticProps({ params: { slug } }) {

  const markdownWithMeta = fs.readFileSync(path.join('posts', slug + '.md'), 'utf-8'); // gets the file content of the markdown files

  const { data: frontmatter, content } = matter(markdownWithMeta); // parse the data from markdownWithMeta into an object

  return {
    props: {
      frontmatter,
      content,
      slug
    }
  }

}