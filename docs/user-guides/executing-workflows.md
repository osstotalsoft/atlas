# 🚲 Executing workflows

As you may have already noticed in the previous chapter, the task parameters can take absolute values, or parametrized values.&#x20;

{% hint style="info" %}
Example:  parameter `"policyType"` can take:

1. absolute value: `"CASCO"`
2. parametrized value: `"${workflow.input.policyType}"`
{% endhint %}

Depending on the tasks parameters in your workflow, you will be prompted to fill in the corresponding values when the dialog is shown.&#x20;

Steps to execute an workflow:

1. Hit Execute Button either from the list of workflows, or the edit page of the corresponding workflow: ![](<../.gitbook/assets/image (1).png>)

2\. A dialog will open and all the parameter values must be set:

![](<../.gitbook/assets/image (6).png>)

{% hint style="info" %}
Each parameter can take string or numeric values, but it can also take Json object values.
{% endhint %}

3\. Hit Execute Button from the dialog and the workflow is now ready to be run by Conductor.

4\. Check out the execution result. To do that,  navigate to "Execution Details" screen by one of the following means:

* &#x20; Hit " Go to execution" button from the dialog ![](<../.gitbook/assets/image (5).png>)
* &#x20; Click on the corresponding link from the list of the workflow executions, found in the right side of the edit screen which can be open for every workflow:&#x20;

![](<../.gitbook/assets/image (3).png>)

* Navigate using the main menu tab: ![](<../.gitbook/assets/image (7).png>)

5\. Analyze the execution details and see all the steps that the flow has taken:

![](<../.gitbook/assets/image (2).png>)

Here, you can see what tasks have been executed and their statuses, review the input values and find out what output was produced, visualize the execution Json, edit the input values and re-execute the workflow.&#x20;

Also, you can visualize the execution diagram and understand the path that the flow has taken and what decision have been made.&#x20;

