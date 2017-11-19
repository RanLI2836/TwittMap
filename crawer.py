import json
from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
from pymongo import MongoClient
from elasticsearch import Elasticsearch, RequestsHttpConnection, serializer, compat, exceptions
from requests_aws4auth import AWS4Auth
import random
from httplib import IncompleteRead
import datetime

# twitter
consumer_key = ''
consumer_secret = ''

access_token_key = ''
access_token_secret = ''

auth = OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token_key, access_token_secret)

count = 0
words = ["Halloween", "Trump",  "job", "music", "Catalonia", "China","weather", "NYC", "news","Vegas"]
class listener(StreamListener):

    def on_data(self, data):
        global count
        #How many tweets you want to find, could change to time based
        if count < 5000:
            try:

                json_data = json.loads(data)
                coords = json_data["coordinates"]
                geo = json_data["geo"]
                place = json_data["place"]
                created_at = json_data["created_at"]
                content = json_data["text"]
                user_name = json_data["user"]["name"]
                screen_name = json_data["user"]["screen_name"]
                id_str = json_data["id_str"]

                created_at =  datetime.datetime.strptime(created_at,'%a %b %d %H:%M:%S +0000 %Y')
                # print created_at
                
                if coords is not None:
                    city = place['name']
                    country = place['country']

                    print "coordinates"
                    lon = coords["coordinates"][0]
                    lat = coords["coordinates"][1]
                    print lat,lon
                    # print user_name, screen_name, created_at, content
                    # self.db_insert(id_str,user_name,screen_name,created_at,content,lat,lon)
                    self.es_insert(id_str,user_name,screen_name,created_at,content,lat,lon, city, country)
                    count += 1
                elif geo is not None:
                    city = place['name']
                    country = place['country']

                    # print data
                    print city, country
                    print "geo"
                    lat = geo['coordinates'][0]
                    lon = geo['coordinates'][1]
                    # print lat,lon
                    print user_name, screen_name, created_at, content
                    # self.db_insert(id_str,user_name,screen_name,created_at,content,lat,lon)
                    self.es_insert(id_str,user_name,screen_name,created_at,content,lat,lon, city, country)
                    count += 1
                elif place is not None:
                    city = place['name']
                    country = place['country']

                    # print data
                    # print city, country
                    print "place"
                    min_x = 90
                    max_x = -90
                    min_y = 180
                    max_y = -180
                    for corner in place['bounding_box']['coordinates'][0]:
                        if corner[1] < min_x:
                            min_x = corner[1]
                        if corner[1] > max_x:
                            max_x = corner[1]
                        if corner[0] < min_y:
                            min_y = corner[0]
                        if corner[0] > max_y:
                            max_y = corner[0]
                    lat = random.uniform(min_x, max_x)
                    lon = random.uniform(min_y, max_y)
                    # print lat,lon
                    print user_name, screen_name, created_at, content
                    # self.db_insert(id_str,user_name,screen_name,created_at,content,lat,lon)
                    self.es_insert(id_str,user_name,screen_name,created_at,content,lat,lon, city, country)
                    
                    count += 1
                return True
            except Exception as e: 
                print "error: "+str(e)+"; data: "+data
                return True
        else:
            return False
        
    # def db_insert(self,id_str,user_name,screen_name,created_at,content,lat,lon):
    #     # mongodb
    #     for word in words:
    #         if word.lower() in content.lower():
    #             client = MongoClient()
    #             db = client.twitter
    #             posts = db[word]
    #             post = {
    #                 "id_str": id_str,
    #                 "user_name": user_name,
    #                 "screen_name": screen_name,
    #                 "created_created_at": created_at,
    #                 "content": content,
    #                 "geo": {"lat":lat, "lon":lon}}
    #             post_id = posts.insert_one(post).inserted_id
    #             print word, post_id

    def es_insert(self,id_str,user_name,screen_name,created_at,content,lat,lon, city, country):
        # AWS keys
        AWS_ACCESS_KEY_ID = ''
        AWS_SECRET_KEY = ''
        region = 'us-east-2' # For example, us-east-1
        service = 'es'
        awsauth = AWS4Auth(AWS_ACCESS_KEY_ID, AWS_SECRET_KEY, region, service)

        host = '' # For example, my-test-domain.us-east-1.es.amazonaws.com

        es = Elasticsearch(
            hosts = host,
            port = 443,
            http_auth = awsauth,
            use_ssl = True,
            verify_certs = True,
            connection_class = RequestsHttpConnection,
            serializer=UnicodeDecoder()
        )

        
        for word in words:
            if word.lower() in content.lower():
                tweet = {
                    "id_str": id_str,
                    "user_name": user_name,
                    "screen_name": screen_name,
                    "created_at": created_at,
                    "content": content,
                    "topic": word,
                    "geo": {"lat":lat, "lon":lon},
                    "city": city,
                    "country": country
                }
                es.index(index="twitters", doc_type="tweet", body=tweet)
        
    def on_error(self, status):
        print status

class UnicodeDecoder(serializer.JSONSerializer):
    """Override elasticsearch library serializer to ensure it encodes utf characters during json dump.
    See original at: https://github.com/elastic/elasticsearch-py/blob/master/elasticsearch/serializer.py#L42
    A description of how ensure_ascii encodes unicode characters to ensure they can be sent across the wire
    as ascii can be found here: https://docs.python.org/2/library/json.html#basic-usage
    """
    def dumps(self, data):
        # don't serialize strings
        if isinstance(data, compat.string_types):
            return data
        try:
            return json.dumps(data, default=self.default, ensure_ascii=True)
        except (ValueError, TypeError) as e:
            raise exceptions.SerializationError(data, e)

if __name__ == "__main__":

    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token_key, access_token_secret)
    # AWS keys
    AWS_ACCESS_KEY_ID = ''
    AWS_SECRET_KEY = ''
    region = 'us-east-2' # For example, us-east-1
    service = 'es'

    awsauth = AWS4Auth(AWS_ACCESS_KEY_ID, AWS_SECRET_KEY, region, service)

    host = '' # For example, my-test-domain.us-east-1.es.amazonaws.com

    es = Elasticsearch(
        hosts = host,
        port = 443,
        http_auth = awsauth,
        use_ssl = True,
        verify_certs = True,
        connection_class = RequestsHttpConnection,
        serializer=UnicodeDecoder()
    )

    mapping = {  
        "settings": {
            "number_of_shards": 1,
            "number_of_replicas": 0
        },
        "mappings":{
            "tweet":{
                "properties":{  
                    "geo": {
                        "type": "geo_point"
                    }
                }
            }
        }
    }

    es.indices.create(index="twitters",ignore=[400],body=mapping)

    while True:
        try:
            twitterStream = Stream(auth, listener())
            twitterStream.filter(track=words)
            break
        except KeyboardInterrupt:
            break
        except:
            print 'ERROR: Unexpected'
            pass
