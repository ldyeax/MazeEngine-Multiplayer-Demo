function windows95Maze(width,height)
{
	function Cell()
	{
		//Walls: 0: Nothing, 1: Brick, 2: Lego Globe Thing
		this.up    = 1;
		this.left  = 1;
		this.right = 1;
		this.down  = 1;
		this.walls = this.up+this.left+this.right+this.down;
		this.secluded = function()
		{
			return(this.up && this.left && this.right && this.down)
		}
	}

	//setup maze full of secluded Cells
	$.rows = new Array();
	for(y=0;y<height;++y)
	{
		$.rows[y] = new Array();
		for(x=0;x<width;++x)
		{
			$.rows[y][x] = new Cell;
			if (!randint(0,10))
			{
				switch(randint(0,3))
				{
					case 0:
						$.rows[y][x].up=2;
						break;
					case 1:
						$.rows[y][x].left=2;
						break;
					case 2:
						$.rows[y][x].right=2;
						break;
					default:
						$.rows[y][x].down=2;
						break;
				}
			}
		}
	}

	function no_secluded_cells()
	{
		for(ya=0;ya<height;++ya)
		{
			for(xa=0;xa<width;++xa)
			{
				if($.rows[ya][xa].secluded())
				{
					return 0
				}
			}
		}
		return 1
	}

	function connect_cells(y,x,y2,x2)
	{	try
		{
			if ($.rows[y2][x2].secluded() /*&& x2>0*/ && x2<$.rows[0].length /*&& y2 > 0*/ && y2 < $.rows.length)
			{
				if (y<y2) //New Cell is below
				{
					$.rows[y2][x2].up=0;
					$.rows[y][x].down=0;
				}
				else if(y>y2) //New Cell is above
				{
					$.rows[y2][x2].down=0;
					$.rows[y][x].up=0;
				}
				else if(x<x2) //New Cell is right
				{
					$.rows[y2][x2].left=0;
					$.rows[y][x].right=0;
				}
				else if(x>x2) //New Cell is left
				{
					$.rows[y2][x2].right=0;
					$.rows[y][x].left=0;
				}
				return 1
			}
		}
		catch(err){}
		return 0;
	}

	function deadend(yb,xb)
	{
		// is any surrounding cell secluded
		if (yb > 0)
		{
			if ($.rows[yb-1][xb].secluded())
			{
				return 0;
			}
		}
		if(yb < $.rows.length-1)
		{
			if ($.rows[yb+1][xb].secluded())
			{
				return 0;
			}
		}
		if(xb > 0)
		{
			if ($.rows[yb][xb-1].secluded())
			{
				return 0;
			}
		}
		if( xb < $.rows[0].length-1)
		{
			if ($.rows[yb][xb+1].secluded())
			{
				return 0;
			}
		}
		
		return 1;
	}

	//Make the path
	var trail = new Array();
	var x = Math.round(width/2)-1;
	var y = height-1;
	var place=0;

	for (place=0;!no_secluded_cells();++place)
	{
		if(deadend(y,x))
		{
			y = trail[place-2][0];
			x = trail[place-2][1];
			place-=2;
		}
		else
		{
			var d = randint(1,4);
			switch(d) 
			{
				case 1: //left
					if (connect_cells(y,x,y,x-1))
					{
						x--;
						break;
					}
					else
					{
						d=2;
					}
				case 2: //right
					if (connect_cells(y,x,y,x+1))
					{
						x++;
						break;
					}
					else
					{
						d=3;
					}
				case 3: //up
					if(connect_cells(y,x,y-1,x))
					{
						y--;
						break;
					}
					else
					{
						d=4;
					}
				case 4: //down
					if(connect_cells(y,x,y+1,x))
					{
						y++;
					}
					else
					{
						d=5;
					}
					break;
				case 5: //left
					if (connect_cells(y,x,y,x-1))
					{
						x--;
						break;
					}
					else
					{
						d=6;
					}
				case 6: //right
					if (connect_cells(y,x,y,x+1))
					{
						x++;
						break;
					}
					else
					{
						d=7;
					}
				case 7: //up
					if(connect_cells(y,x,y-1,x))
					{
						y--;
						break;
					}
			}
			trail[place] = [y,x];
		}
	}
}
