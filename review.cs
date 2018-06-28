using System;

namespace BoxApplication{
	class Box{
		private double length;
		private double breadth;

		public Box(){
			System.Console.WriteLine("Object is being created");
		}
		public void setLength(double len){
			length = len;
		}
		public double displayLength(){
			return length;
		}

		public void setBreadth(double bre){
			breadth = bre;
		}

		public double Calc(){
			return length*breadth;
		}
		~Box(){
			System.Console.WriteLine("object is being deleted")
		}
	}

	class Boxtester{
		static void Main (string[] args){
			double volume;
			Box Box1 = new Box();
			Box Box2 = new Box();

			Box1.setLength(10.0);
			Box1.setBreadth(10.0);
			System.Console.WriteLine(Box1.displayLength());

			Box2.setLength(13.12);
			Box2.setBreadth(77.9);

			volume = Box1.Calc();
			
			System.Console.WriteLine(volume);
		}
	}
}

/*
https://www.tutorialspoint.com/csharp/csharp_classes.htm
http://zajacmarek.com/2016/02/kurs-c-cz-5-wlasciwosci-properties/

*/

namespace StaticVarApplication {
   class StaticVar {
	  public static int num;
	  
	  public void count() {
		 num++;
		 Console.WriteLine(num);
	  }
	  public int getNum() {
		 return num;
	  }
   }
   class StaticTester {
	  static void Main(string[] args) {
		 StaticVar s1 = new StaticVar();
		 
		var jsonob = false;
		Console.WriteLine(jsonob.GetType());
		Console.WriteLine(5 & 2 );

		 s1.count();
		 s1.count();
		 s1.count();
		 StaticVar s2 = new StaticVar();
		 s2.count();
		 s2.count();
		 s2.count();
		 
		 Console.WriteLine("Variable num for s1: \n {0}", s1.getNum());
		 Console.WriteLine("Variable num for s2: \r {0}", s2.getNum());
		 Console.ReadKey();

		 /*
infinite loop
         for (; ; ) {
            Console.WriteLine("Hey! I am Trapped");
         }
		 */
	  }
   }
}

//https://www.tutorialspoint.com/csharp/csharp_encapsulation.htm