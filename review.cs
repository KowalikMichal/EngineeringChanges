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


using System;

class Test{
	static void Main(string[] arg){
		int [] b = new int []{2,2};
		int [] a = new int []{3,2};
		
		for (int i=0; i < b.Length; i++){
			Console.WriteLine(a[i] == b[i]);
		} 
		var x = Array.FindAll(a, element => element > 23);
		Console.WriteLine(x[0]);

	}
}

 for (int i = 0; i < N; i++)
            Console.WriteLine(new String('#', i + 1).PadLeft(N, ' '));

            using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.Collections;
using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;
using System.Text;
using System;

class Solution {

    // Complete the birthdayCakeCandles function below.
    static int birthdayCakeCandles(int[] ar, int arCount) {
        int Max = ar.Max();
        int Size = ar.Where(x=> x == Max).ToArray().Length;
        return Size;

    }

    static void Main(string[] args) {
        TextWriter textWriter = new StreamWriter(@System.Environment.GetEnvironmentVariable("OUTPUT_PATH"), true);

        int arCount = Convert.ToInt32(Console.ReadLine());

        int[] ar = Array.ConvertAll(Console.ReadLine().Split(' '), arTemp => Convert.ToInt32(arTemp))
        ;
        int result = birthdayCakeCandles(ar, arCount);

        textWriter.WriteLine(result);

        textWriter.Flush();
        textWriter.Close();
    }
}

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

class Solution {

    /*
     * Complete the timeConversion function below.
     */
    static string timeConversion(string s) {
        int PM = s.IndexOf("PM");
        
        string returnValue;
        int HH = Int32.Parse(s.Substring(0,2));
        Console.WriteLine(HH);
        if (PM > -1){
           returnValue = ((HH % 12) + 12) + s.Substring(2, 6);
        }
        else{
            returnValue = s.Substring(0, 8);
        }
        return returnValue;
    }

    static void Main(string[] args) {
        TextWriter tw = new StreamWriter(@System.Environment.GetEnvironmentVariable("OUTPUT_PATH"), true);

        string s = Console.ReadLine();

        string result = timeConversion(s);

        tw.WriteLine(result);

        tw.Flush();
        tw.Close();
    }
}
//12:40:22AM


using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

class Solution {

    /*
     * Complete the timeConversion function below.
     */
    static string timeConversion(string s) {
        DateTime timeValue = Convert.ToDateTime(s);
        string returnValue = timeValue.ToString("HH:mm:ss");

        return returnValue;
    }

    static void Main(string[] args) {
        TextWriter tw = new StreamWriter(@System.Environment.GetEnvironmentVariable("OUTPUT_PATH"), true);

        string s = Console.ReadLine();

        string result = timeConversion(s);

        tw.WriteLine(result);

        tw.Flush();
        tw.Close();
    }
}

//diagonal
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.Collections;
using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;
using System.Text;
using System;

class Solution {

    // Complete the diagonalDifference function below.
    static int diagonalDifference(int[][] arr) {
        int LeftToRight = 0;
        int RightToLeft = 0;
        int result = 0;
        
        for (int i=0; i < arr.Length; i++){
            for (int j=0; j < arr.Length; j++){
                if(i == j){
                   LeftToRight += arr[i][j]; 
                }
                if (i == arr.Length - j - 1){
                    RightToLeft += arr[i][j];
                }
            }
        }

        result = Math.Abs(LeftToRight-RightToLeft);
        return result;
    }

    static void Main(string[] args) {
        TextWriter textWriter = new StreamWriter(@System.Environment.GetEnvironmentVariable("OUTPUT_PATH"), true);

        int n = Convert.ToInt32(Console.ReadLine());

        int[][] arr = new int[n][];

        for (int i = 0; i < n; i++) {
            arr[i] = Array.ConvertAll(Console.ReadLine().Split(' '), arrTemp => Convert.ToInt32(arrTemp));
        }

        int result = diagonalDifference(arr);

        textWriter.WriteLine(result);

        textWriter.Flush();
        textWriter.Close();
    }
}

//stairs
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.Collections;
using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;
using System.Text;
using System;

class Solution {

    // Complete the staircase function below.
    static void staircase(int n) {
        for (int i = 0; i < n; i++){
            Console.WriteLine(new String('#', i + 1).PadLeft(n, ' '));
        }
    }

    static void Main(string[] args) {
        int n = Convert.ToInt32(Console.ReadLine());

        staircase(n);
    }
}

//marks
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

class Solution {

    /*
     * Complete the gradingStudents function below.
     */
    static int[] gradingStudents(int[] grades, int n) {
        int [] marks = new int [n];
        
        for(int i=0; i < n; i++){
            int roundornot = 5 - (grades[i] % 5);
            int addValue = 0;
            
            if (roundornot <3 && grades[i] >= 38){
                marks[i] = grades[i] + roundornot;
            }
            else{
                 marks[i] = grades[i];
            }
        }
        
        return marks;

    }

    static void Main(string[] args) {
        TextWriter tw = new StreamWriter(@System.Environment.GetEnvironmentVariable("OUTPUT_PATH"), true);

        int n = Convert.ToInt32(Console.ReadLine());

        int[] grades = new int [n];

        for (int gradesItr = 0; gradesItr < n; gradesItr++) {
            int gradesItem = Convert.ToInt32(Console.ReadLine());
            grades[gradesItr] = gradesItem;
        }

        int[] result = gradingStudents(grades, n);

        tw.WriteLine(string.Join("\n", result));

        tw.Flush();
        tw.Close();
    }
}
//nwd
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.Collections;
using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;
using System.Text;
using System;

class Solution {

    // Complete the kangaroo function below.
    static string kangaroo(int x1, int v1, int x2, int v2) {
    string result ="NO";
    int a = Math.Abs(v1 - x1);
    int b = Math.Abs(v2 - x2);
    
    if(v2>v1 && x2>x1 || v2<v1 && x2<x1){
        return result; 
    }
        
    int c = a % b;
    
    
    while (c != 0){
     Console.WriteLine(a);
        a =b;
        if(a > 1000){
            break;
        }
        b = c;
        c = a % b;
    }
  
    if (c == 0){
        result = "YES";
    }
        return result;
    }

    static void Main(string[] args) {
        TextWriter textWriter = new StreamWriter(@System.Environment.GetEnvironmentVariable("OUTPUT_PATH"), true);

        string[] x1V1X2V2 = Console.ReadLine().Split(' ');

        int x1 = Convert.ToInt32(x1V1X2V2[0]);

        int v1 = Convert.ToInt32(x1V1X2V2[1]);

        int x2 = Convert.ToInt32(x1V1X2V2[2]);

        int v2 = Convert.ToInt32(x1V1X2V2[3]);

        string result = kangaroo(x1, v1, x2, v2);

        textWriter.WriteLine(result);

        textWriter.Flush();
        textWriter.Close();
    }
}


