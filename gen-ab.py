import shutil, re

# function to generate dev enviroment from template folder
def generate_dev_enviroment(test_directory, test_id):
	# try using shutil.copytree() to duplicate the Template folder into the test_directory
	try:
		shutil.copytree('.\\Template', test_directory)
	# raise error
	except Exception as e:
		raise e
	# Let the user know it was successful
	print("Template generated in %a" % test_directory)

def init():
	print("Starting AB Test Generator")
	test_id = input("What is the test ID? ")
	test_name = input("What is the test called? ")
	test_device = input("What device(s) will it run on? ")
	test_directory = input("Where is the test directory? (leave blank for default location) ")

	if test_directory == "":
		test_directory = "..\\"
	else:
		test_directory = test_directory + "\\"
		test_directory = re.sub(r'\\\\$', '\\', test_directory)

	test_directory = "%s%s - %s - %s" % (test_directory, test_id, test_name, test_device)

	print("Generating files for %a" % test_id)
	generate_dev_enviroment(test_directory, test_id)

# Autorun init function
if __name__ == "__main__":
	init()