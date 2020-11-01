# Shorten url 



1. Clone the project in some folder on your machine
2. Navigate to producer using command line tools and run:<br>
    - <b>npm install</b><br>
   This will restore node dependencies
3. <b>Repeat step 2 for subscriber</b><br>
4. Navigate to producer using command line tools
5. After you're inside the producer run the following command:
    - <b>docker-compose up -d</b><br>
6. If it is all successfull , check the following: 
    -localhost:8080 (phpmyadmin)
    -localhost:15672 (rabbitmq management)
7. Credentials for phpmyadmin :
    - Username: <b>root</b><br>
    - Password: <b>root</b><br>
8. Credentials for rabbitmq management :
    - Username: <b>guest</b><br>
    - Password: <b>guest</b><br>
9. Navigate to both publisher and subscriber and type the following in terminal to start applications:
    - <b>npm start</b> <br>
    
<b>Testing the app.</b><br>
<b>All requests are made using Postman </b>

1. Open Postman and in the request window select the request type as POST and in the url bar paste the following URL
    - http://localhost:3000/shortener
2. Underneath the url bar there is a Body tab for sending the data withing the request
   Select the "raw" content format and on the left dropdown select "application/json" as content type and send followin json:
   - { 
        "url": "https://www.nsoft.com/job-application/?job_id=7661"
     }
3. After you click the Send button, you will get formatted response containing Id, URL that you sent, and short representation of the url
4. ShortURL contains the url of the subscriber service so you can click on the link from response, and it will open new tab in postman
   Example: http://localhost:4000/redirection/A1a3
5. You can click Send button again and the request will be sent to the subscriber service

For the response you will get the page itself because of the redirection from the application, you can see it in the preview 
section of the body response, or just paste the short url in the browser and send the request again.

<b>Testing the DELETE method on the publisher service</b><br>
1. Repeat step 1 for the POST request on publisher service, just instead of POST type select DELETE from dropdown 
2. For the body of request, please send following json:
    - { "id": take_Id_from_db} 
   You can check the records in the database on phpmyadmin on localhost:8080 
3. Send the request 

As response of the DELETE request, you will get the id, hash, and property which indicates that the record has been deleted.
Hash part is important for Redis, since we're deleting values by the key which is hash part of the URL.


<b>Rate limiter</b><br>
Our Redirection API has been limited to 10 requests for 120 seconds window time.
Try repeating request and when it passes 10th request, you will get the 429 response from the API.<br>

<b> As in POST request for the publisher service, please try to send url with https, since redirection is going outside of our domain.<b><br>


Check the console for logging info.
