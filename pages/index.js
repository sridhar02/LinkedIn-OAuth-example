import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import queryString from "query-string";
import _ from "lodash";

import styles from "../styles/Home.module.css";
import { Typography, Button } from "@material-ui/core";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const LinkedIn = {
    response_type: "code",
    client_id: `${process.env.NEXT_PUBLIC_CLIENT_ID}`,
    redirect_uri: `${process.env.NEXT_PUBLIC_REDIRECT_URI}`,
    state: "DCEeFWf45A53sdfKef424",
    scope: `r_liteprofile`,
  };

  const profileURL = queryString.stringify(LinkedIn);
  const authURL = `https://www.linkedin.com/oauth/v2/authorization/?${profileURL}`;

  const requestSever = async () => {
    const { code, state } = router.query;
    if (code === undefined) return;
    const authToken = localStorage.getItem("token");
    try {
      const response = await axios.get(`/api/auth/${code}`);
      if (response.status === 200) {
        setUser(response.data);
        router.push("/");
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    requestSever();
  }, [router.query]);
  const imageURL = _.get(
    _.last(_.get(user, "profilePicture.displayImage~.elements", "")),
    "identifiers[0].identifier",
    ""
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Typography variant="h6">React LinkedIN Login Example</Typography>
        <Typography variant="body2">
          A demo page for linkedin OAuth example using linkedin API
        </Typography>
        {user === "" ? (
          <Button color="primary" variant="contained">
            <a href={authURL}>Loginin with linkedIN</a>
          </Button>
        ) : (
          <div style={{ textAlign: "center" }}>
            <Typography variant="h6">
              Name: {user.localizedFirstName + " " + user.localizedLastName}
            </Typography>
            <img src={imageURL} style={{ width: "25em" }} />
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
