using System;

namespace BoxApplication{
	class Box{
		private double length;
		private double breadth;

		public void setLength(double len){
			length = len;
		}

		public void setBreadth(double bre){
			breadth = bre;
		}

		public double Calc(){
			return length*breadth;
		}
	}

	class Boxtester{
		static void Main (string[] args){
			double volume;
			Box Box1 = new Box();
			Box Box2 = new Box();

			Box1.setLength(10.0);
			Box1.setBreadth(10.0);

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