import axios from "axios";
import queryString from "query-string";

function getLinkedInAuthorizationCode(code) {
  const params = {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: `${process.env.REDIRECT_URI}`,
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  };

  const query = queryString.stringify(params);

  return axios.get(`https://www.linkedin.com/oauth/v2/accessToken?${query}`);
}

function getLinkedInUserData(accessToken) {
  return axios.get(
    `https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))`,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

module.exports = async (req, res) => {
  const { code } = req.query;
  if (code !== undefined || null) {
    try {
      let response = await getLinkedInAuthorizationCode(code);
      if (response.status === 200) {
        response = await getLinkedInUserData(response.data.access_token);
        if (response.status === 200) {
          res.json(response.data);
          return;
        }
      }
      throw new Error();
    } catch (error) {
      res.status(403);
    }
  }
};
