import shodan
import yaml



def shodan_lookup(ip):
    with open('../config.yaml','r') as f:
        conf = yaml.load(f)


    API_KEY = conf['shodanData']['apikey']

    api = shodan.Shodan(API_KEY)

    results = api.host(ip)
    # results = api.scan(ip)

    return results



if __name__ == "__main__":

    value = str(input("Enter an IP: "))
    results = shodan_lookup(value)
    print(results)

