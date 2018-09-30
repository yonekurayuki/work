# coding: UTF-8

from flask import Flask, jsonify, request
from hashlib import sha256
import requests

#genesis_block
genesis_block = {'no' : 0, 'transaction' : ['this is genesis block, from paiza'], 'nonce' : '', \
                 'prev_hash' : 'NONE', 'hash' : '', 'diff' : 2, 'unixtime' : 1537247368} 

#blockのハッシュ値を計算するために文字列結合
genesis_block_str = str(genesis_block['no']) \
                     + ",".join(genesis_block['transaction']) \
                     + str(genesis_block['nonce']) \
                     + genesis_block['prev_hash'] \
                     + str(genesis_block['unixtime'])

#ハッシュ値計算
genesis_block_byte = genesis_block_str.encode('utf-8')
genesis_block_hash = sha256(genesis_block_byte).hexdigest()
genesis_block['hash'] = genesis_block_hash

#ブロックチェーン生成
app = Flask(__name__)
block_chain = []
block_chain.append(genesis_block)
nodes = []
pool = []

@app.route('/add_transaction', methods=['GET'])
def add_transaction():
    transaction = request.args.get('transaction')
    pool.append(transaction)
    return jsonify(pool)

@app.route('/get_pool', methods=['GET'])
def get_pool():
    return jsonify(pool)

@app.route('/remove_pool', methods=['GET'])
def remove_pool():
    transaction = request.args.get('transaction')
    pool.remove(transaction)
    return jsonify(pool)

@app.route('/last_block', methods=['GET'])
def last_block():
    return jsonify(block_chain[-1])

@app.route('/get_block', methods=['GET'])
def get_block():
    no = request.args.get('no')
    if no and len(block_chain) > int(no):
        block = block_chain[int(no)]
    else:
        block = {}
    return jsonify(block)

@app.route('/get_node', methods=['GET'])
def get_node():
    return jsonify(nodes)

@app.route('/add_node', methods=['GET'])
def add_node():
    node = request.args.get('node')
    if node and node not in nodes:
        nodes.append(node)
        r = requests.get("http://" + node + "/add_node?node=0.0.0.0:" + str(my_port))
    return jsonify(nodes)

@app.route('/block_chain', methods=['GET'])
def get_block_chain():
    check_node()
    return jsonify(block_chain)

def check_node():
    max_no = len(block_chain)-1
    max_node = "0.0.0.0:1234" #暫定的に自分のノードを指定しておく
    for node in nodes: #各ノードに対してlast_blockをしていって最も大きなブロックナンバーを取得
        r = requests.get("http://"+node+"/last_block")
        if r.status_code == 200:
            json_data = r.json()
            if max_no < json_data['no']:
                max_no = json_data['no']
                max_node = node
 
    if max_no != 0: #自分より長いブロックがあったのならば
        r = requests.get("http://"+max_node+"/get_block?no="+str(len(block_chain)-1)) #自分の持ってる最新のブロックと相手の持っている同じ番号のブロックを取得
        if r.status_code == 200:
            json_data = r.json()
            if json_data['hash'] == block_chain[-1]['hash']: #ハッシュ値が一致していることを確認する。
                for i in range(len(block_chain), max_no+1): #以降ブロックを繋いでいく(本当はhashとprev_hashがちゃんと繋がっているか検証したほうが良い。
                    r = requests.get("http://" + max_node + "/get_block?no="+str(i))
                    if r.status_code == 200:
                        json_data = r.json()
                        block_chain.append(json_data)


import time,datetime
@app.route('/mining', methods=['GET'])
def mining():
    global pool
    for i in range(10000000):
        nodes_pool = []
        remove_pools = {}
        for node in nodes: #各nodeのトランザクションプールから取引情報を取得取り込みます。
            r = requests.get("http://"+node+"/get_pool")
            if r.status_code == 200:
                json_data = r.json()
                remove_pools[node] = json_data
                nodes_pool.extend(json_data)
        next_block_no = len(block_chain) #次のブロックナンバーを決める
		#genesisブロックと同じ形でブロックを作成します。
        mining_block = {'no' : next_block_no, 'transaction' : pool+nodes_pool, 'nonce' : i, \
                        'prev_hash' : block_chain[next_block_no-1]['hash'],
                        'hash' : '', 'diff' : block_chain[next_block_no-1]['diff'], 'unixtime' : 0}
        mining_block['unixtime'] = int(datetime.datetime.now().timestamp())
        mining_block_str = str(mining_block['no']) \
                           + ",".join(mining_block['transaction']) \
                           + str(mining_block['nonce']) \
                           + mining_block['prev_hash'] \
                           + str(mining_block['unixtime'])
        mining_block_byte = mining_block_str.encode('utf-8')
        mining_block_hash = sha256(mining_block_byte).hexdigest()
        mining_block['hash'] = mining_block_hash

        check_hash = bin(int(mining_block_hash, 16))[2:] #ハッシュ値を2進数に変換します。
        print(check_hash[:20], check_hash.index('0')) 

		#2進数化したハッシュ値の1が何個並んでいるかを難易度とし0が出現した場所がdiffより大きいか検証、大きければ採掘成功。
        if check_hash.index('0') > block_chain[next_block_no-1]['diff']:
			#採掘難易度を調整します。 60 * 3 秒 より採掘時間が短ければ難易度アップ、逆であれば難易度ダウンです
            if mining_block['unixtime'] - 60*3 < block_chain[next_block_no-1]['unixtime']:
                mining_block['diff'] += 1
            else:
                mining_block['diff'] -= 1

			#完成したブロックを追加、更に取引プールを消していきます。(この処理は取引プール側でブロックチェーンで見つけたら消すが正しい処理ですが簡単化しています。
            block_chain.append(mining_block)
            for k, v in remove_pools.items():
                for trans in v:
                    print("http://" + k + "/remove_pool?transaction=")
                    r = requests.get("http://" + k + "/remove_pool?transaction=" + trans)
            pool = []
            break
        else:
            mining_block = {}
    return jsonify(mining_block)

import sys
my_port = None
if __name__ == "__main__":
    my_port = int(sys.argv[1])
    app.run('0.0.0.0', my_port, use_reloader=True)
