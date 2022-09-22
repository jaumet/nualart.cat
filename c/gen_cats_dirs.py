import os

cats = ["comentaris","english","stream","catala","riereta","kuduro","musica","on stage","lecture","visualizations","cuines","projects","drets/righwts","events","academia","code","writings"]

my_command = ""
for c in cats:
	os.system("cp -r english "+c)

#print my_command
#os.system(my_command)
