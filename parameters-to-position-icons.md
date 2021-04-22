*** 1 activity ***

margin_top 	--> floor()
margin_left --> ceil()

1 row
-----
margin_top  = | height x 0.375 |
margin_left = | width x 0.588 |

2 rows
------
margin_top  = | height x 0.638 |
margin_left = | width x 0.679 |

3 rows
------
margin_top  = | height x 0.625 |
margin_left = | width x 0.895 |, w < 40
			= | width x 0.718 |, w >= 40 && < 80
			= | width x 0.641 |, w >= 80

4 rows
------
margin_top  = | height x 0.694 |
margin_left = | width x 0.969 |, w < 40
			= | width x 0.852 |, w >= 40
