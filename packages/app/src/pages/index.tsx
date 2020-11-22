import Head from 'next/head'
import styles from '../../styles/Home.module.css';
import {withSSRContext} from "aws-amplify";
import {ssrMe} from "../generated/page";
import Link from 'next/link'


// export async function getServerSideProps(context) {
//   // const { Auth } = withSSRContext(context);
//   // try {
//   //   const u = await Auth.currentAuthenticatedUser();
//   // } catch {
//   //   console.log('fetch user failed')
//   // }
//
//   return await ssrMe.getServerPage({
//     errorPolicy: 'all',
//   }, context)
// }

export default function Home() {
  console.log(props)
  return (
    <div className={styles.container}>
      {JSON.stringify(data)}
      <Link href='sign-in'>sign in </Link>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}


Home.getInitialProps = async ({req}) => {
  return await ssrMe.getServerPage({
    errorPolicy: 'all',
  }, req)
}