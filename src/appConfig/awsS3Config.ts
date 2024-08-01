import AWS from "aws-sdk"

export default function awsS3Config() {
  const REGION = `${process.env.REACT_APP_AWS_FILE_REGION}`;
  const accessKey = `${process.env.REACT_APP_AWS_ACCESS_KEY}`!;
  const secretKey = `${process.env.REACT_APP_AWS_SECRET_KEY}`!;

  const myConfig = new AWS.Config({
    credentials : {
      accessKeyId : accessKey,
      secretAccessKey : secretKey,
    },
    region : REGION
  });
  return new AWS.S3(myConfig)
}