import shutil, re

# function to generate dev enviroment from template folder
def generate_dev_enviroment(test_directory, test_id, custom_dimension):
	# try using shutil.copytree() to duplicate the Template folder into the test_directory
	try:
		shutil.copytree('.\\Template', test_directory)
	# raise error
	except Exception as e:
		raise e
	# Call the implement test_id function to change the Test ID JS variable
	implement_test_id(test_directory, test_id, custom_dimension)
	# Let the user know it was successful
	print("Template generated in %a" % test_directory)

# Opens a file and replaces the specified content with the desired content
def open_and_update_file(file, old_content, new_content):
	# try opening file with read permissions
	try:
		readable_file = open(file, 'r', encoding="utf8")
	# raise errors
	except Exception as e:
		raise e
	# store file content in variable
	file_content = readable_file.read()
	# replace old_content with new_content and store in variable
	updated_content = file_content.replace(old_content, new_content)
	# close readable version of file
	readable_file.close()
	# try opening file with write permissions
	try:
		writeable_file = open(file, 'w', encoding="utf8")
	# raise errors
	except Exception as e:
		raise e
	# replace file content with updated content
	writeable_file.write(updated_content)
	# close file
	writeable_file.close()

# Opens the control and variation_1 js files and updates the test ids
def implement_test_id(test_directory, test_id, custom_dimension):
	# determine the build directory and store it in a variable
	build_directory = "%s\\Code\\build\\" % (test_directory)
	# store the control.js file path in a variable
	control_file = build_directory + "control.js"
	# store the variation_1.js file path in a variable
	variation_file = build_directory + "variation_1.js"
	variation_style_file = build_directory + "modules\\variation_1.scss"
	# Call the open_and_update_file function on the control file
	open_and_update_file(control_file, 'const test_id = "AWL"', 'const test_id = "%s"' % test_id)
	open_and_update_file(control_file, 'const custom_dimension = "18"', 'const custom_dimension = "%s"' % custom_dimension)
	# Call the open_and_update_file function on the variation_1 file
	open_and_update_file(variation_file, 'const test_id = "AWL"', 'const test_id = "%s"' % test_id)
	open_and_update_file(variation_file, 'const custom_dimension = "18"', 'const custom_dimension = "%s"' % custom_dimension)
	open_and_update_file(variation_style_file, 'body {', '.%s_loaded {' % test_id)

def init():
	print("Starting AB Test Generator")
	test_id = input("What is the test ID? ")
	test_name = input("What is the test called? ")
	test_device = input("What device(s) will it run on? ")
	custom_dimension = input("Which custom dimension? ")
	test_directory = input("Where is the test directory? (leave blank for default location) ")

	if test_directory == "":
		test_directory = "..\\..\\Optimisation\\2020\\Tests\\"
	else:
		test_directory = test_directory + "\\"
		test_directory = re.sub(r'\\\\$', '\\', test_directory)

	test_directory = "%s%s - Test - BCohen - %s %s" % (test_directory, test_id, test_name, test_device)

	print("Generating files for %a" % test_id)
	generate_dev_enviroment(test_directory, test_id, custom_dimension)

if __name__ == "__main__":
	init()