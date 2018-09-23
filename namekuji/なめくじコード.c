＜なめくじゲーム　コード＞

#include <stdio.h>
#include <stdlib.h>
#include <time.h>


/*構造体型宣言*/
struct player{
	char name[10];    //名前
	int hp, kou, shu; //HP,攻撃力,守備力
};

/*プロトタイプ宣言*/
int damage1(int, int, int);  //player->なめくじのダメージ計算関数
int damage2(int, int);  //なめくじ->playerのダメージ計算関数



int main()
{
	/*変数宣言*/
	struct player namekuji = { "なめくじ", 3000, 200, 100 };  //プレーヤーのＨＰ、攻撃、守備
	struct player kkun = { "Ｋ君", 2000, 100, 200 };
	struct player yonepon = { "よねぽん", 2000, 200, 100 };
	int psentaku = 0;  //プレーヤーの選択（1,2）
	int bsentaku = 0;   //武器の選択（1,2,3）
	int save;


	/*タイトル*/
	printf("     <なめくじクエスト>\n これはなめくじと戦うゲームです。\n\n");

	/*なめくじとの遭遇*/
	printf("野生のなめくじが現れた！\n なめくじ　ＨＰ３０００　攻２００　守１００\n\n");

	/*プレーヤーの選択*/
	while (psentaku!=1 && psentaku!=2){
	printf("\nプレーヤーを1,2から選択して下さい。\n 1.K君　    ＨＰ２０００　攻１００　守２００\n 2.よねぽん　ＨＰ２０００　攻２００　守１００\n");
	scanf_s("%d", &psentaku);    //1,2どちらかを入力
	if (psentaku==1 || psentaku==2){
		break;
		
      }
	printf("1,2のいずれかを入力してください\n");
  }

switch(psentaku){

case 1:                     //Ｋ君がプレーヤーの場合

		/*HPがなくなるまで戦闘ループ*/
		while (1){

			/*武器の選択*/
			while (bsentaku != 1 && bsentaku != 2 && bsentaku != 3){
				printf("\n武器を選択してください。\n 1.おの　攻３００　命中６０％\n 2.銃　  攻５００　命中３０％\n 3.剣　  攻２００　命中９０％\n");
				scanf_s("%d", &bsentaku);    //1,2,3いずれかを入力
				if (bsentaku == 1 || bsentaku == 2 || bsentaku == 3){
					break;
				}
				printf("1,2,3のいずれかを入力してください\n");
			}
			printf("\n<Ｋ君の攻撃！>\n");

			/*プレーヤーの攻撃*/
			srand((unsigned)time(NULL));  //乱数の種を自動生成
			switch (bsentaku){
			case 1:                       //おの
				if (rand() % 10 + 1 <= 6){
					printf("ヒット！\n");
					namekuji.hp = namekuji.hp - damage1(kkun.kou, 300, namekuji.shu);   //当たった場合ダメージ計算
				}
				else
				{
					printf("攻撃は外れた！\n");                                //外れた場合
				}
				break;

			case 2:                      //銃
				if (rand() % 10 + 1 <= 3){
					printf("ヒット！\n");
					namekuji.hp = namekuji.hp - damage1(kkun.kou, 500, namekuji.shu);
				}
				else{
					printf("攻撃は外れた！\n");
				}
				break;

			case 3:                      //剣 
				if (rand() % 10 + 1 <= 9){
					printf("ヒット！\n");
					namekuji.hp = namekuji.hp - damage1(kkun.kou, 200, namekuji.shu);  
				}
				else{

					printf("攻撃は外れた！\n");
				}
				break;

            }

			printf("\n残りＨＰ\n なめくじ%d　K君%d　\n", namekuji.hp, kkun.hp);   //残りＨＰの表示

			if (namekuji.hp <= 0){
				break;                           //なめくじのＨＰがなくなったらループを抜ける

			}
			bsentaku = 0;                        //武器選択の初期化

			/*なめくじの攻撃*/
			printf("\n<なめくじの攻撃！>\n");
			if (rand() % 10 + 1 <= 7){
				printf("ヒット！");
				kkun.hp = kkun.hp - damage2(namekuji.kou, kkun.shu);   //当たった場合ダメージ計算

			}
			else{
				printf("\nなめくじはうねうねしている！");      //外れた場合
			}
			
			printf("\n残りＨＰ\n なめくじ%d　K君%d　\n", namekuji.hp, kkun.hp);   //残りＨＰの表示

			if (kkun.hp <= 0){
				break;                      //プレーヤーのＨＰがなくなったらループを抜ける
			}

		}    //戦闘ループ終わり



		/*結果の出力*/
		if (kkun.hp <= 0){
			printf("\nＨＰがなくなりました。K君はなめくじになりました。。\n");
		}

		if (namekuji.hp <= 0){
			printf("\nなめくじを倒した！おめでとうございます！\n");
		}


break;  //Ｋ君のswitch文を抜ける


case 2:                 //よねぽんがプレーヤーの場合

		/*HPがなくなるまで戦闘ループ*/
		while (1){

			/*武器の選択*/
			while (bsentaku != 1 && bsentaku != 2 && bsentaku != 3){
				printf("\n武器を選択してください。\n 1.おの　攻３００　命中６０％\n 2.銃　  攻５００　命中３０％\n 3.剣　  攻２００　命中９０％\n");
				scanf_s("%d", &bsentaku);    //1,2,3いずれかを入力
				if (bsentaku == 1 || bsentaku == 2 || bsentaku == 3){
					break;
				}
				printf("1,2,3のいずれかを入力してください\n");
			}
			printf("\n<よねぽんの攻撃！>\n");

			/*プレーヤーの攻撃*/
			srand((unsigned)time(NULL));  //乱数の種を自動生成
			switch (bsentaku){
			case 1:                       //おの
				if (rand() % 10 + 1 <= 6){
					printf("ヒット！\n");
					namekuji.hp = namekuji.hp - damage1(yonepon.kou, 300, namekuji.shu);   //当たった場合ダメージ計算
				}
				else
				{
					printf("攻撃は外れた！\n");                                //外れた場合
				}
				break;

			case 2:                      //銃
				if (rand() % 10 + 1 <= 3){
					printf("ヒット！\n");
					namekuji.hp = namekuji.hp - damage1(yonepon.kou, 500, namekuji.shu);
				}
				else{
					printf("攻撃は外れた！\n");
				}
				break;

			case 3:                      //剣 
				if (rand() % 10 + 1 <= 9){
					printf("ヒット！\n");
					namekuji.hp = namekuji.hp - damage1(yonepon.kou, 200 , namekuji.shu);
				}
				else{
					printf("攻撃は外れた！\n");
				}
				break;



			}
			printf("\n残りＨＰ\n なめくじ%d　よねぽん%d　\n", namekuji.hp, yonepon.hp);   //残りＨＰの表示

			if (namekuji.hp <= 0){
				break;                           //なめくじのＨＰがなくなったらループを抜ける

			}
			bsentaku = 0;                        //武器選択の初期化

			/*なめくじの攻撃*/
			printf("\n<なめくじの攻撃！>\n");
			if (rand() % 10 + 1 <= 7){
				printf("ヒット！\n");
				yonepon.hp = yonepon.hp - damage2(namekuji.kou, yonepon.shu);   //ダメージ計算
				
			}
			else
			{
				printf("\nなめくじはうねうねしている！");
			}
			
			printf("\n残りＨＰ\n なめくじ%d　よねぽん%d　\n", namekuji.hp, yonepon.hp);   //残りＨＰの表示

			if (yonepon.hp <= 0){
				break;                      //プレーヤーのＨＰがなくなったらループを抜ける
			}

		}    //whileループ終わり



		/*結果の出力*/
		if (yonepon.hp <= 0){
			printf("\nＨＰがなくなりました。よねぽんはなめくじになりました。。\n");
		}

		if (namekuji.hp <= 0){
			printf("\nなめくじを倒した！おめでとうございます！\n");
		}






break;   //よねぽんのswitch文を抜ける



}


	

	/*画面の維持*/
	scanf_s("%d", &save);



	return(0);
	

}

/*****************************************************/
/*関数名：damage1                                　　 */
/*引数：プレーヤーの攻撃、武器の攻撃、なめくじの守備(int)*/
/*戻り値：damage1(int)                                */
/*処理：player->なめくじのダメージ計算　　　　　　　　　*/
/*****************************************************/
int damage1(int pkou, int bkou, int namesyubi)
{ 
	int damage;
	damage = pkou*bkou / namesyubi;

	return(damage);

}




/*****************************************************/
/*関数名：damage2                                　　 */
/*引数：なめくじの攻撃、プレーヤーの守備(int)*/
/*戻り値：damage2(int)                                */
/*処理：なめくじ->playerのダメージ計算　　　　　　　　　*/
/*****************************************************/
int damage2(int namekou, int psyubi)
{
	int damage;
	damage = namekou*namekou / psyubi;

	return(damage);

}

