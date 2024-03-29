import boto3


class S3ReadFileService:
    def __init__(self, storage_service):
        self.client = boto3.client('s3')
        self.bucket_name = storage_service.get_storage_location()

    def detect_text(self, file_name):
        lines = []
        try:
            # Get the file inside the S3 Bucket
            s3_response = self.client.get_object(
                Bucket= self.bucket_name,
                Key= file_name
            )

            # Get the Body object in the S3 `get_object()` response
            s3_object_body = s3_response.get('Body')

            # Read the data in bytes format and convert it to a string
            content_str = s3_object_body.read().decode()

            # Seperate the file contents as a line list
            lines = content_str.split('\r\n')

        except self.client.exceptions.NoSuchBucket as e:
            # S3 Bucket does not exist
            print('The S3 bucket does not exist.')
            print(e)

        except self.client.exceptions.NoSuchKey as e:
            # Object does not exist in the S3 Bucket
            print('The S3 object does not exist in the S3 bucket.')
            print(e)

        return lines
