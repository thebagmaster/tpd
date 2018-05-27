import json


with open('subscriber.json') as json_file:  
    data = json.load(json_file)
    newfile = {}
    for p in data:
        for e in data[p]['emotes']:
            newfile[e['code']] = e['id']

with open('global.json') as json_file:  
    data = json.load(json_file)
    for p in data:
        newfile[data[p]['code']] = data[p]['id']


with open('all.json', 'w') as outfile:  
    json.dump(newfile, outfile)
