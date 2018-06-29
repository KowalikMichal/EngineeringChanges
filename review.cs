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

using System;

namespace Array{
	class MyArray{
		static void Main(string[] args){
			int [] MyArray = new int[10];
			int i,j;

			for(i=0; i<10; i++){
				MyArray[i]=i;
			}
			/*for (j=0; j<10; j++){
				System.Console.WriteLine(MyArray[j]);
			}*/
			foreach (int z in MyArray) System.Console.WriteLine(z);
		}
	}
}


using System;

namespace Manipulete{
	class NumberManipulate{
		public int AddItem(int p, int n){
			int result;
			result = p+n;
			return result;
		}
		static void Main(string[] args){
			int a = 10;
			int b=20;
			int ret;

			NumberManipulate n = new NumberManipulate();

			ret = n.AddItem(a, b);
			Console.WriteLine(ret);
		}
	}
}

//calculate mean
using System;
namespace Mean{
	class CalcMean{
		public double Calc(int [] arr){
			double valeuToReturn = 0;
			foreach (int val in arr) valeuToReturn += val;
			return valeuToReturn/arr.Length;
		}
		public int Add(int []arr){
			int valeuToReturn = 0;
			foreach (int val in arr) valeuToReturn += val;
			return valeuToReturn;
		}

		static void Main(string[] args){
			double result;
			int resultAdd;

			int [] NewArray = new int []{1,2,13};

			CalcMean calc = new CalcMean();
			result = calc.Calc(NewArray);
			resultAdd = calc.Add(NewArray);

			System.Console.WriteLine(result);
			System.Console.WriteLine(resultAdd);
		}
	}
}


//structures

using System;

struct Books {
	public string title;
	public string author;
}

public class TestStructure{
	public static void Main(string[] arg){
		Books Box1;

		Box1.title = "tile";
		Box1.author = "author";
		Console.WriteLine("{0}, title: {1}",Box1.title, Box1.author);
	}
}


//check if value is in the array

using System;

class CheckExist{
	public bool Exist(int [] arr, int target){
		foreach(var key in arr){
			if(key == target){
				return true;
			}
		}
		return false;
	}

	static void Main(string[] arg){
		int [] arrValue = new int []{1,2,3,4,5};
		int target = 3;

		int x = Array.IndexOf(arrValue, target);

		Console.WriteLine(x);

		CheckExist n = new CheckExist();
		Console.WriteLine(n.Exist(arrValue, 125));

	}
}