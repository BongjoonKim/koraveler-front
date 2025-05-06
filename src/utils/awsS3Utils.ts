import awsS3Config from "../appConfig/awsS3Config";

export const s3Utils = {
  async getFile(props : any) {
    const S3 = awsS3Config();
    S3.getObject({
      Bucket : "haries-img",
      Key : props.fileKey
    })
  },
  
  async getThumbnailFile(props : any) {
    const S3 = awsS3Config();
    S3.getObject({
      Bucket : "haries-thumbnail",
      Key : props.fileKey
    })
  },
  
  async getFiles(props : any) {
    const S3 = awsS3Config();
    const response = await S3.listObjectsV2({
      Bucket : "haries-img",
      Prefix : props.prefix
    });
    return response.promise().then(el => el.Contents)
  },
  
  async uploadFile(props : any) {
    const S3 = awsS3Config();
    const response = await S3.upload({
      Bucket : "haries-img",
      Key : props.fileKey,
      Body : props.file,
    })
    
    return response.promise().then(el => el.Location)
  },
  
  async copyFile(props : any) {
    const S3 = awsS3Config();
    const params = {
      Bucket: "haries-img",
      CopySource: `haries-img/${props.fileKey}`, // 원본 버킷/키
      Key: `${props.newFileKey}`, // 대상 버킷/키
    }
    const response = await S3.copyObject(params);
    return response.promise().then(el => el.CopyObjectResult);
  },
  
  async deleteFile(props : any) {
    const S3 = awsS3Config();
    console.log("props 확인", props)
    const params = {
      Bucket: "haries-img",
      Key: `${props.fileKey}`, // 원본 버킷/키
    }
    const response = await S3.deleteObject(params, function(err, data) {
      console.log('에러 확인', err);
      console.log('삭제 확인', data)
    });
    console.log("삭제 결과 값", response)
    return response;
  },
  
  async deleteFiles(props : any) {
    const S3 = awsS3Config();
    const params = {
      Bucket : "haries-img",
      Delete: {
        Objects : props.Keys
      },
    }
    console.log("삭제 파람", params)
    const response = await S3.deleteObjects(params, (error, data) => {
      console.log('에러 확인', error);
      console.log('삭제 확인', data)
    });
    return response;
  }
}